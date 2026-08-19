"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button';
import { imageUrl } from '@/lib/constants';
import { getReviewExamQuestion, GetUserSubscribedCourses, updateUserCourseApi } from '@/services/course';
import { getAllFinalExamQuestion } from '@/services/exam';
import { ArrowLeft, Award, BadgeCheck, Bell, Check, CheckCircle2, Download, FileText, Loader, Mail, Monitor, Phone, Play, Settings, Star, ThumbsUp, XCircle } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { jsPDF } from 'jspdf';
import { getHeader } from '@/services/common';
import MuxPlayer from '@mux/mux-player-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ViewWebinar = () => {
    const params = useParams<{ videoPath?: string[] }>();
    const searchParams = useSearchParams();
    const [slug, setSlug] = useState("");
    const [muxPlaybackId, setMuxPlaybackId] = useState("");
    const [isReviewExamPassed, setIsReviewExamPassed] = useState(false);
    const [lastVideoViewed, setLastVideoViewed] = useState(0);
    const [userCourseId, setUserCourseId] = useState<number | null>(null);
    const [courseCompletedOn, setCourseCompletedOn] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [prTime, setPrTime] = useState(0);
    const [finalExamId, setFinalExamId] = useState<string>("");
    const [finalquestionList, setFinalquestionList] = useState<any[]>([]);
    const [finalQuestionCount, setFinalQuestionCount] = useState(0);
    const [err, setErr] = useState("");
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [viewerUserId, setViewerUserId] = useState("");
    const [pauseBtnCount, setPauseBtnCount] = useState(0);
    const [playBtnCount, setPlayBtnCount] = useState(0);
    const [isPlay, setIsPlay] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [videoWatchTime, setVideoWatchTime] = useState("0");
    const [vidViewPercent, setVidViewPercent] = useState("0.00");
    const [isAnswerTrue, setIsAnswerTrue] = useState(false);
    const [showQuestionOnTime, setShowQuestionOnTime] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showFirstReviewQuestion, setShowFirstReviewQuestion] = useState(false);
    const [isTimeoutCleared, setIsTimeoutCleared] = useState(false);
    const [nextQuesRemainingTime, setNextQuesRemainingTime] = useState(0);
    const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);
    const [isDownloadingHandout, setIsDownloadingHandout] = useState(false);
    const [scoreObtained, setScoreObtained] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [totalPercentage, setTotalPercentage] = useState("0");
    const [passPercentage, setPassPercentage] = useState(70);
    const [isShow, setIsShow] = useState(false);
    const [examResultType, setExamResultType] = useState<"pass" | "fail" | "">("");
    const [isCaptionOn, setIsCaptionOn] = useState(false);
    const [finalAnswerJson, setFinalAnswerJson] = useState<any[]>([]);
    const [reviewExamQuestions, setReviewExamQuestions] = useState<any[]>([]);

    const videoRef = useRef<any>(null);
    const prTimeRef = useRef(0);
    const showReviewQTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sendViewIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isPausedRef = useRef(false);
    const isAnswerTrueRef = useRef(false);
    const showFirstReviewQuestionRef = useRef(false);

    useEffect(() => {
        // Get video URL from query parameters (preserves full URL with query params)
        const videoUrlParam = searchParams.get('videoUrl');
        const slugParam = searchParams.get('slug');

        // If videoUrl is provided as query param, use it as muxPlaybackId
        if (videoUrlParam) {
            setMuxPlaybackId(videoUrlParam);
        } else {
            // Fallback: try to extract from path params for backward compatibility
            const pathSegments = Array.isArray(params?.videoPath) ? params.videoPath : [];
            const urlParam = pathSegments.slice(0, pathSegments.length - 2).join("/") || pathSegments[0] || "";
            setMuxPlaybackId(urlParam);
        }

        if (slugParam) {
            setSlug(slugParam);
        } else {
            // Fallback: extract from path params
            const pathSegments = Array.isArray(params?.videoPath) ? params.videoPath : [];
            const slug = pathSegments[pathSegments.length - 2] || "";
            setSlug(slug);
        }

        setViewerUserId(localStorage.getItem("userId") || "");
    }, [params, searchParams]);

    const isReviewExamExist = finalquestionList.length > 0;

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        isAnswerTrueRef.current = isAnswerTrue;
    }, [isAnswerTrue]);

    useEffect(() => {
        showFirstReviewQuestionRef.current = showFirstReviewQuestion;
    }, [showFirstReviewQuestion]);

    const openReviewQuestionPrompt = () => {
        setShowFirstReviewQuestion(true);
        setShowQuestionOnTime(false);
    };

    const showReviewQuestions = () => {
        setShowFirstReviewQuestion(true);
        setErr("");
    };

    const CheckAnswer = () => {
        setIsAnswerTrue(true);
        setShowQuestionOnTime(false);
        setShowFirstReviewQuestion(false);
    };

    const resumeCountdown = () => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
        setIsTimeoutCleared(false);
    };

    const sendVidViewToUsercourse = () => {
        if (!userCourseId) return;

        const storedVideoWatchTime = localStorage.getItem("videoWatchTime");

        const jsonData = {
            data: {
                lastVideoView: Number(storedVideoWatchTime || 0),
            }
        };

        updateUserCourse(jsonData);
    };

    const webinarTitle = useMemo(() => {
        if (!slug) return "Self-Study";

        return slug
            .split("-")
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    }, [slug]);

    const playbackSource = useMemo(() => {
        if (!muxPlaybackId) {
            return { src: "", type: "application/x-mpegURL" };
        }

        let decoded = decodeURIComponent(muxPlaybackId).trim();
        decoded = decoded.replace(/^https?:\/(?!\/)/i, (match) => `${match}/`);
        if (/^stream\.mux\.com\//i.test(decoded)) {
            decoded = `https://${decoded}`;
        }

        if (/^https?:\/\//i.test(decoded)) {
            const isMp4 = decoded.toLowerCase().includes('.mp4');
            return {
                src: decoded,
                type: isMp4 ? "video/mp4" : "application/x-mpegURL",
            };
        }

        const cleanId = decoded.replace(/^\/+|\/+$/g, "");
        const hasKnownExtension = cleanId.toLowerCase().endsWith('.m3u8') || cleanId.toLowerCase().endsWith('.mp4');
        const src = hasKnownExtension
            ? `https://stream.mux.com/${cleanId}`
            : `https://stream.mux.com/${cleanId}.m3u8`;

        return {
            src,
            type: cleanId.toLowerCase().endsWith('.mp4') ? "video/mp4" : "application/x-mpegURL",
        };

    }, [muxPlaybackId]);

    const webinarImage = searchParams.get("image") || "";

    const getFinalquestionListing = async (id: string) => {
        try {

            const res: any = await getAllFinalExamQuestion(id);

            if (res?.exams?.data?.length > 0) {
                const finalquestiondata = res.exams.data[0]?.attributes?.questions || [];
                setFinalExamId(res.exams.data[0]?.id || "");

                const finalquestions = finalquestiondata.map((element: any) => {
                    const questionOptions = (element?.options || []).map((item: any) => ({
                        id: item.id,
                        option: item.option,
                        isAnswer: item.isAnswer,
                    }));

                    return {
                        id: element.id,
                        isMCQ: true,
                        selectedAnswer: "",
                        title: element.title,
                        options: questionOptions,
                    };
                });

                setFinalquestionList(finalquestions);
                setFinalQuestionCount(finalquestions.length);

            } else {
                setFinalExamId("");
                setFinalquestionList([]);
                setFinalQuestionCount(0);
            }
        } catch (error) {
            console.log('error in fetching course listing', error);
        }
    };

    const getUserCourse = async (courseSlug: string) => {
        const userEmail = localStorage.getItem("email") || "";
        if (!userEmail || !courseSlug) return null;

        const res: any = await GetUserSubscribedCourses(userEmail);

        if (res) {
            const filterCourses = res?.data?.filter((element: any) => {
                return element.attributes?.course?.data?.attributes?.slug === courseSlug;
            });

            if (filterCourses?.length > 0) {
                const selectedCourse = filterCourses[0];
                const viewedTime = Number(selectedCourse?.attributes?.lastVideoView || 0);
                const courseDetails = selectedCourse?.attributes?.course?.data?.attributes || null;

                setIsReviewExamPassed(!!selectedCourse?.attributes?.isReviewExamPassed);
                setLastVideoViewed(viewedTime);
                setVideoWatchTime(String(viewedTime));
                setVidViewPercent((viewedTime > 0 && selectedCourse?.attributes?.duration
                    ? ((viewedTime * 100) / Number(selectedCourse.attributes.duration || 1)).toFixed(2)
                    : "0.00"));
                localStorage.setItem("videoWatchTime", String(viewedTime));
                setUserCourseId(Number(selectedCourse?.id) || null);
                setCourseCompletedOn(selectedCourse?.attributes?.completedOn || null);
                setPrTime(viewedTime);
                setSelectedCourse(courseDetails);

                return {
                    course: courseDetails,
                    completedOn: selectedCourse?.attributes?.completedOn || null,
                };
            }

            const video = document.getElementsByTagName('video')[0];
            if (video) {
                video.currentTime = Number(lastVideoViewed || 0);
            }
        }

        return null;
    };

    const getReviewQuestionListing = async (id: any) => {
        try {
            const res = await getReviewExamQuestion(id);
            const reviewExams = res?.reviewExams?.data || [];

            console.log('reviewExams', reviewExams);

            if (reviewExams.length > 0) {
                const reviewExam = reviewExams[0];
                const questionData = reviewExam?.attributes?.questions || [];
                const mappedQuestions = questionData.map((element: any) => {
                    const questionOptions = (element?.options || []).map((item: any) => ({
                        id: item.id,
                        option: item.option,
                        isAnswer: item.isAnswer,
                        hint: item.hint,
                    }));

                    const duration = String(element?.durationInminute || "00:00");
                    const [hours = "0", minutes = "0"] = duration.split(":");
                    const timeStampInSeconds = (Number(hours) * 60 * 60) + (Number(minutes) * 60);

                    return {
                        id: element.id,
                        isMCQ: true,
                        selectedAnswer: "",
                        title: element.title,
                        options: questionOptions,
                        timeStampInSeconds,
                    };
                });

                setReviewExamQuestions(mappedQuestions);
            } else {
               
            }
        } catch (error) {
            console.log('error in fetching review question listing', error);
        }
    };

    const formatCompletedDate = (completedOn: string | null) => {
        if (!completedOn) return "";
        const date = new Date(completedOn);
        if (Number.isNaN(date.getTime())) return "";

        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
        });
    };

    const downloadCertificate = async () => {
        setIsDownloadingCertificate(true);
        try {
            const courseResult = await getUserCourse(slug);
            const course = courseResult?.course || selectedCourse;
            const completedOn = courseResult?.completedOn || courseCompletedOn;

            if (!course) {
                setErr("Course details are not available for certificate download.");
                return;
            }

            const templatePath = course?.certificateTemplate?.data?.attributes?.url;
            if (!templatePath) {
                setErr("Certificate template is not configured for this course.");
                return;
            }

            const title = course?.title || "course";
            const credit = String(course?.credit || "");
            const medium = course?.medium || "";
            const fieldStudy = course?.fieldOfStudy || "";
            const program = course?.programNumber || "";
            const usernameFromStorage = localStorage.getItem("username") || "";
            const datecompleted = formatCompletedDate(completedOn);
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            const templateUrl = `${baseUrl}${templatePath}`;

            const response = await fetch(templateUrl);
            const templateHtml = await response.text();

            let html = templateHtml
                .replace(/{{username}}/g, usernameFromStorage)
                .replace(/{{course}}/g, title)
                .replace(/{{credit}}/g, credit)
                .replace(/{{medium}}/g, medium)
                .replace(/{{fieldStudy}}/g, fieldStudy)
                .replace(/{{completedOn}}/g, datecompleted)
                .replace(/{{program}}/g, program);

            if (usernameFromStorage) {
                html = html.replace(/{{username_alt}}/g, usernameFromStorage);
            }

            const doc = new jsPDF('p', 'pt', [745, 745]);
            doc.html(html, {
                callback: function (pdfDoc: any) {
                    pdfDoc.save(`certificate_${title}.pdf`);
                },
            });
        } catch (error) {
            console.error("Certificate download failed", error);
            setErr("Unable to download certificate right now. Please try again.");
        } finally {
            setIsDownloadingCertificate(false);
        }
    };

    const downloadHandout = async () => {
        setIsDownloadingHandout(true);
        try {
            const courseResult = await getUserCourse(slug);
            const course = courseResult?.course || selectedCourse;

            if (!course) {
                setErr("Course details not available for handout download.");
                return;
            }

            const handoutsData = course?.handout?.data;
            if (!handoutsData || !Array.isArray(handoutsData) || handoutsData.length === 0) {
                setErr("No handouts available for this course.");
                return;
            }

            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            let downloadCount = 0;

            for (const handout of handoutsData) {
                const handoutUrl = handout?.attributes?.url;
                if (!handoutUrl) continue;

                const fileUrl = `${baseUrl}${handoutUrl}`;
                const response = await fetch(fileUrl);
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = objectUrl;
                link.download = handout?.attributes?.name || `handout-${downloadCount + 1}`;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(objectUrl);

                downloadCount++;
            }

            if (downloadCount === 0) {
                setErr("No valid handouts could be downloaded.");
            } else {
                setErr("");
            }
        } catch (error) {
            console.error("Handout download failed", error);
            setErr("Unable to download handouts. Please try again.");
        } finally {
            setIsDownloadingHandout(false);
        }
    };

    useEffect(() => {
        if (!slug) return;
        getUserCourse(slug);
        getFinalquestionListing(slug);
        getReviewQuestionListing(slug);
    }, [slug]);

    async function updateUserCourse(data: any) {
        await updateUserCourseApi(userCourseId, data);
    }

    const syncVideoProgress = (currentTime: number, duration: number) => {
        try {
            const watched = Math.floor(currentTime).toFixed(0);
            setVideoWatchTime(watched);
            localStorage.setItem("videoWatchTime", watched);

            if (duration > 0) {
                const percent = ((Number(watched) * 100) / duration).toFixed(2);
                setVidViewPercent(percent);
            }

            setPrTime(currentTime);
            prTimeRef.current = currentTime;
        } catch (error) {
            console.error("Error updating video time:", error);
        }
    };

    const handleVideoProgress = (event: any) => {
        const target = event?.target || videoRef.current;
        const currentTime = Number(target?.currentTime ?? 0);
        const duration = Number(target?.duration ?? 0);

        syncVideoProgress(currentTime, duration);

        if (showQuestionOnTime && !isAnswerTrueRef.current && !target?.seeking) {
            target?.pause?.();
            openReviewQuestionPrompt();
        }
    };

    const handleVideoLoadedMetadata = (event: any) => {
        const target = event?.target || videoRef.current;
        if (!target) return;

        const savedViewedTime = Number(lastVideoViewed || videoWatchTime || 0);
        if (savedViewedTime > 0 && Number(target.currentTime || 0) === 0) {
            target.currentTime = savedViewedTime;
            syncVideoProgress(savedViewedTime, Number(target.duration || 0));
            localStorage.setItem("videoWatchTime", String(savedViewedTime));
        }
    };

    const handleVideoPlay = () => {
        setPlayBtnCount((prevPlayCount) => {
            const nextCount = prevPlayCount + 1;
            setIsPlay(true);

            if ((nextCount === 1 || showFirstReviewQuestionRef.current) && isReviewExamExist && !isReviewExamPassed) {
                showReviewQuestions();
            }

            if (nextCount > 1 && !isAnswerTrueRef.current && showQuestionOnTime) {
                if (isReviewExamExist) {
                    setIsPaused(true);
                }
            }

            if (nextCount > 1 && isAnswerTrueRef.current && currentQuestionIndex < finalquestionList.length - 1) {
                resumeCountdown();
            }

            return nextCount;
        });

        setIsPaused(false);
        const bigPlayButton = document.querySelector('.vjs-big-play-button') as HTMLElement | null;
        if (bigPlayButton) {
            bigPlayButton.style.display = 'none';
        }
    };

    const handleVideoPause = () => {
        const currentTarget = videoRef.current;
        const currentTime = Number(currentTarget?.currentTime ?? 0);

        setPauseBtnCount((prev) => prev + 1);
        setIsPlay(false);
        setIsPaused(true);

        const bigPlayButton = document.querySelector('.vjs-big-play-button') as HTMLElement | null;
        if (bigPlayButton) {
            bigPlayButton.style.display = 'block';
        }

        if (showFirstReviewQuestionRef.current) {
            if (showReviewQTimeoutIdRef.current) {
                clearTimeout(showReviewQTimeoutIdRef.current);
                showReviewQTimeoutIdRef.current = null;
            }
        } else {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }
            setIsTimeoutCleared(true);

            if (isReviewExamExist && currentQuestionIndex < finalquestionList.length - 1) {
                const nextQuestion = finalquestionList[currentQuestionIndex + 1];
                const nextQuestionTime = Number((nextQuestion as any)?.timeStampInSeconds ?? 0);

                if (Number.isFinite(nextQuestionTime) && nextQuestionTime > 0) {
                    setNextQuesRemainingTime(Math.max(0, Math.floor(nextQuestionTime - currentTime)));
                } else {
                    setNextQuesRemainingTime(0);
                }
            }
        }

        if (sendViewIntervalRef.current) {
            clearInterval(sendViewIntervalRef.current);
            sendViewIntervalRef.current = null;
        }
    };

    const handleVideoPlaying = () => {
        if (!isPausedRef.current && videoRef.current) {
            let time = Math.floor(videoRef.current.currentTime).toFixed(0);
            localStorage.setItem("videoWatchTime", time);
            setVideoWatchTime(time);
            sendVidViewToUsercourse();
        }

        if (!sendViewIntervalRef.current) {
            sendViewIntervalRef.current = setInterval(() => {
                if (!isPausedRef.current && videoRef.current) {
                    let time = Math.floor(videoRef.current.currentTime).toFixed(0);
                    localStorage.setItem("videoWatchTime", time);
                    setVideoWatchTime(time);
                    sendVidViewToUsercourse();
                }
            }, 5000);
        }
    };

    const handleVideoEnded = () => {
        if (sendViewIntervalRef.current) {
            clearInterval(sendViewIntervalRef.current);
            sendViewIntervalRef.current = null;
        }
        setVidViewPercent("100.00");
        setPrTime(0);
        prTimeRef.current = 0;
    };

    const handleVideoSeeking = () => {
        const currentTarget = videoRef.current;
        if (!currentTarget) return;

        const delta = currentTarget.currentTime - prTimeRef.current;
        if (Math.abs(delta) > 1) {
            currentTarget.currentTime = prTimeRef.current;
        }
    };

    const selectAnswer = (option: any, selectedIndex: number) => {
        const selectedAnswer = String(option ?? "").trim();

        setFinalquestionList((prevList) => {
            const selectedQuestion = prevList[selectedIndex];
            const questionTitle = selectedQuestion?.title?.trim() || "";

            setFinalAnswerJson((prevAnswers) => {
                const nextList = [...prevAnswers];
                nextList[selectedIndex] = {
                    question: questionTitle,
                    answer: selectedAnswer,
                };
                return nextList;
            });

            return prevList.map((question, index) =>
                index === selectedIndex
                    ? { ...question, selectedAnswer: option }
                    : question
            );
        });
    };

    const handleFinalAnswerChange = (questionIndex: number, optionValue: string) => {
        setFinalquestionList((prevList) =>
            prevList.map((question, index) =>
                index === questionIndex
                    ? { ...question, selectedAnswer: optionValue }
                    : question
            )
        );

        selectAnswer(optionValue, questionIndex);
    };

    const reviewExamsAnswer = (selectedOption: string, questionIndex: number) => {
        if (questionIndex < 0 || questionIndex >= finalquestionList.length) return;

        const currentQuestion = finalquestionList[questionIndex];
        const safeOption = String(selectedOption ?? "").trim();

        setFinalquestionList((prevList) =>
            prevList.map((question, index) =>
                index === questionIndex
                    ? { ...question, selectedAnswer: safeOption }
                    : question
            )
        );

        setFinalAnswerJson((prevList) => {
            const nextList = [...prevList];
            nextList[questionIndex] = {
                question: currentQuestion?.title?.trim() || "",
                answer: safeOption,
            };
            return nextList;
        });

        setCurrentQuestionIndex(questionIndex);
    };

    const checkFinalAnswers = () => {
        const finalAnswerJson = finalquestionList.map((question: any) => ({
            question: question?.title?.trim() || "",
            answer: question?.selectedAnswer?.trim() || "",
        }));

        const hasEmptyAnswer = finalAnswerJson.some((item) => !item.question || !item.answer);

        if (finalAnswerJson.length !== finalQuestionCount || hasEmptyAnswer) {
            const message = 'Make sure you have answered each question';
            setErr(message);
            setShowSubmitConfirm(false);
        } else {
            setErr("");
            setShowSubmitConfirm(true);
        }

        SubmitFinal(finalAnswerJson);
    };

    const SubmitFinal = async (finalAnswerJson: any[]) => {
        setShowSubmitConfirm(false);
        try {
            const todayDate = new Date().toISOString().split("T")[0];

            // Get pass percentage
            const headerRes = await getHeader(); // replace with actual API
            const pass = headerRes?.data?.data?.attributes?.examPassPercentage || 70;

            setPassPercentage(pass);

            const record = {
                data: {
                    answerJson: finalAnswerJson, // make sure this exists in state
                    exam: finalExamId,           // same here
                    startedOn: todayDate,
                    endedOn: todayDate,
                },
            };

            const token = localStorage.getItem("token") || "";

            let response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/user-exams", {
                method: "POST",
                body: JSON.stringify(record),
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "content-type": "application/json"
                },
            })

            let res = await response.json();

            if (
                res.error?.status === 400 &&
                res.error?.message
                    ?.toLowerCase()
                    .includes("already given the exam")
            ) {
                setErr("You have already submitted the exam. Multiple attempts are not allowed.");
            }

            if (res?.data) {
                const score = res?.data.attributes.score;
                const total = res?.data.attributes.totalScore;

                setScoreObtained(score);
                setTotalScore(total);

                const percentage = ((score * 100) / total).toFixed(2);
                setTotalPercentage(percentage);

                const passed = parseFloat(percentage) >= pass;
                setExamResultType(passed ? "pass" : "fail");
                setIsShow(true);
            }
        } catch (error: any) {

            if (
                error?.response?.status === 400 &&
                error?.response?.data?.error?.message
                    ?.toLowerCase()
                    .includes("already given the exam")
            ) {
                setErr("You have already submitted the exam. Multiple attempts are not allowed.");
            }
        }
    };

    const programMaterials = [
        "CPE Certificate",
        "Forms (if applicable)",
        "Glossary of Terms",
        "Table Of Contents",
    ];

    const faqItems = [
        {
            question: "What is this service about?",
            answer: "This service provides a platform to manage and streamline your workflow efficiently.",
            isOpen: false
        },
        {
            question: "How can I sign up?",
            answer: "You can sign up by visiting our registration page and following the instructions.",
            isOpen: false
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept credit cards, PayPal, and bank transfers.",
            isOpen: false
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Yes, you can cancel your subscription at any time from your account settings.",
            isOpen: false
        }
    ];

    return (
        <div className='mx-8'>
            <Link href="/learner/dashboard" className="inline-flex items-center border w-full bg-violet-100 px-4 py-2 gap-2 text-violet-700 font-semibold text-base cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
            </Link>
            <div className="flex flex-col gap-5 w-full mt-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <h1 className="text-gray-900 text-xl font-semibold leading-8">
                                Self-Study
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex gap-6 text-lg font-semibold w-full">
                <Tabs defaultValue="overview" className=" bg-transparent w-full">
                    <TabsList variant="line" className='w-1/3 bg-transparent'>
                        <TabsTrigger value="overview" className="text-xl  font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Overview</TabsTrigger>
                        <TabsTrigger value="final-exam" className="text-xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Final Exam</TabsTrigger>
                        <TabsTrigger value="faq" className="text-xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">FAQ</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div className="w-full rounded-2xl bg-gray-100 p-6 shadow-sm">
                            <div className="flex flex-col gap-5 md:flex-row md:items-center">
                                <div className="w-full max-w-[210px] rounded-2xl border-[6px] border-violet-300 bg-white p-2 shadow-[0_10px_24px_rgba(148,107,255,0.28)]">
                                    <img
                                        src={webinarImage}
                                        alt={webinarTitle}
                                        className="h-[120px] w-full rounded-xl object-cover"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h3 className="text-2xl font-bold leading-tight text-slate-900">
                                        {webinarTitle}
                                    </h3>
                                    <p className="font-semibold leading-none text-amber-600">
                                        {vidViewPercent} % Complete...keep it going!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            <div className="rounded-2xl bg-gray-100 px-8 py-7 shadow-sm ring-1 ring-black/5">
                                <div className="flex h-full gap-5">
                                    <Bell className="h-30 w-30 text-fuchsia-400 -rotate-10" strokeWidth={1.6} />
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold leading-none text-slate-900">
                                            Enable Popup
                                        </h3>
                                        <p className="text-slate-700">
                                            Please enable pop-ups in your browser when watching this program.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-gray-100 px-8 py-7 shadow-sm ring-1 ring-black/5">
                                <div className="flex h-full gap-5">
                                    <FileText className="h-30 w-30 text-fuchsia-400" strokeWidth={1.6} />
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold leading-none text-slate-900">
                                            Taking the Test
                                        </h3>
                                        <p className="text-slate-700">
                                            You must score at least 70% on the final exam to obtain a CPE certificate.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-gray-100 px-8 py-7 shadow-sm ring-1 ring-black/5">
                                <div className="flex h-full gap-5">
                                    <BadgeCheck className="h-30 w-30 text-fuchsia-400" strokeWidth={1.6} />
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold leading-none text-slate-900">
                                            CPE Certificate
                                        </h3>
                                        <p className="text-slate-700">
                                            Once you complete the final exam, your CPE certificate will be available for download.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section className="mt-8 rounded-2xl border border-gray-200 bg-gray-100 p-4 shadow-sm md:p-6">
                            <div className="grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
                                <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-200 p-1.5 shadow-sm">
                                    <div className="h-full rounded-xl bg-black/80 p-0.5">
                                        <div className="grid h-full grid-cols-1">
                                            <div className="relative overflow-hidden bg-slate-900 p-4">
                                                {playbackSource.src && (
                                                    <MuxPlayer
                                                        ref={videoRef}
                                                        playbackId={playbackSource.src.split('/').pop()?.split('.')[0] || ''}
                                                        streamType="on-demand"
                                                        defaultHiddenCaptions={!isCaptionOn}
                                                        onTimeUpdate={handleVideoProgress}
                                                        onLoadedMetadata={handleVideoLoadedMetadata}
                                                        onPlay={handleVideoPlay}
                                                        onPause={handleVideoPause}
                                                        onPlaying={handleVideoPlaying}
                                                        onEnded={handleVideoEnded}
                                                        onSeeking={handleVideoSeeking}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '0.75rem',
                                                        }}
                                                    >
                                                    </MuxPlayer>
                                                )}

                                                <div className="absolute bottom-5 right-6 rounded-md bg-black/60 px-3 py-2 text-xs text-white">
                                                    Watched: {videoWatchTime}s ({vidViewPercent}%)
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="mb-5 flex items-center justify-between gap-1">
                                        <h3 className="font-semibold text-slate-900">Program Material</h3>
                                        <button
                                            type="button"
                                            onClick={downloadHandout}
                                            disabled={isDownloadingHandout}
                                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition-all ${isDownloadingHandout
                                                ? "border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed opacity-60"
                                                : "border-indigo-300 text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                                                }`}
                                        >
                                            {isDownloadingHandout ? (
                                                <Loader className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Download className="h-5 w-5" />
                                            )}
                                            {isDownloadingHandout ? "Downloading..." : "Download"}
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {programMaterials.map((item) => (
                                            <div key={item} className="flex items-center gap-3 rounded-xl bg-gray-100 p-4">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-white">
                                                    <Check className="h-4 w-4" />
                                                </span>
                                                <span className="text-slate-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={downloadCertificate}
                                        disabled={isDownloadingCertificate}
                                        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold text-white transition-all ${isDownloadingCertificate
                                            ? "bg-gray-400 cursor-not-allowed opacity-60 hover:bg-gray-400"
                                            : "bg-slate-400 hover:bg-slate-500 cursor-pointer"
                                            }`}
                                    >
                                        {isDownloadingCertificate ? (
                                            <Loader className="h-5 w-5 text-amber-300 animate-spin" />
                                        ) : (
                                            <Download className="h-5 w-5 text-amber-300" />
                                        )}
                                        {isDownloadingCertificate ? "Downloading..." : "Download Certificate"}
                                    </button>
                                </aside>
                            </div>
                        </section>

                        {reviewExamQuestions.length > 0 && !isReviewExamPassed && (
                            <div id="reviewQuestionsSection" className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xl font-semibold text-gray-800">Review Questions</h2>

                                {reviewExamQuestions[currentQuestionIndex] && (
                                    <div className="space-y-4">
                                        <h6 className="text-lg font-medium text-gray-700">
                                            {reviewExamQuestions[currentQuestionIndex]?.title}
                                        </h6>

                                        <div className="space-y-2">
                                            {reviewExamQuestions[currentQuestionIndex]?.options?.map((question: any, questionIndex: number) => (
                                                <label
                                                    key={question?.id || questionIndex}
                                                    className="flex cursor-pointer items-center space-x-3 rounded-md border border-gray-200 p-3 transition hover:bg-gray-100"
                                                >
                                                    <input
                                                        type="radio"
                                                        id={`question_${questionIndex}`}
                                                        name={`option_${currentQuestionIndex}`}
                                                        value={question?.option}
                                                        checked={reviewExamQuestions[currentQuestionIndex]?.selectedAnswer == question?.option}
                                                        onChange={() => reviewExamsAnswer(question?.option, currentQuestionIndex)}
                                                        disabled={isAnswerTrue}
                                                        className="h-4 w-4 text-blue-500 focus:ring focus:ring-blue-300"
                                                    />
                                                    <span className="text-gray-700">{question?.option}</span>
                                                </label>
                                            ))}
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={CheckAnswer}
                                            disabled={isAnswerTrue}
                                            className="mt-2 bg-blue-500 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Check Answer
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        <section className="mt-8 mb-4 rounded-none bg-[#e9ecf6] px-6 py-10 md:px-12">
                            <div className="mx-auto max-w-7xl">
                                <div className="mx-auto max-w-4xl text-center">
                                    <h2 className="text-2xl font-bold text-slate-900">Loop us in</h2>
                                    <p className="mt-4 leading-relaxed text-slate-700">
                                        Our team is here to chat from Monday to Friday <strong>8am to 5pm</strong> ET. Closed on <strong>US Holidays and weekends.</strong>
                                    </p>
                                </div>

                                <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    <div className="rounded-2xl bg-white text-center p-8 shadow-sm ring-1 ring-black/5">
                                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                                            <Settings className="h-6 w-6" />
                                        </span>
                                        <h3 className="mt-5 text-xl font-bold text-slate-900">Social Media</h3>
                                        <p className="mt-2 text-slate-700">Connect with us</p>
                                        <div className="mt-4 flex justify-center items-center gap-4 text-indigo-600">
                                            <FaLinkedinIn className="h-8 w-8 text-white bg-indigo-500 p-2" />
                                            <FaInstagram className="h-5 w-5" />
                                            <FaFacebookF className="h-8 w-8 text-white bg-indigo-500 p-2 rounded-full" />
                                            <FaXTwitter className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
                                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                                            <Mail className="h-6 w-6" />
                                        </span>
                                        <h3 className="mt-5 text-xl font-bold text-slate-900">Email us</h3>
                                        <p className="mt-2  text-slate-700">The carrier pigeons are idle</p>
                                        <p className="mt-3  font-semibold text-slate-700">cpe@cpewarehouse.com</p>
                                    </div>

                                    <div className="rounded-2xl bg-white text-center p-8 shadow-sm ring-1 ring-black/5">
                                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                                            <Phone className="h-6 w-6" />
                                        </span>
                                        <h3 className="mt-5 text-xl font-bold text-slate-900">Call us</h3>
                                        <p className="mt-2 text-slate-700">speak to a human</p>
                                        <p className="mt-3 font-semibold text-slate-700">+1(437)291-1446</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </TabsContent>
                    <TabsContent value="final-exam">
                        <section className="mt-8 border-t border-gray-300 px-4 pt-2 pb-8 md:px-6">
                            <div className="mx-auto">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-slate-900">Final Exam</h2>
                                    <p className="mt-2 font-semibold text-slate-800">{finalQuestionCount} Questions</p>
                                </div>

                                {
                                    finalquestionList.length > 0 && finalquestionList.map((item: any, index: number) => (
                                        <div className="mt-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm" key={item?.id || index}>
                                            <p className="font-semibold leading-snug text-slate-900">
                                                {index + 1}. {item.title}
                                            </p>

                                            <div className="mt-4 space-y-3">
                                                {
                                                    item.options.length > 0 && item.options.map((option: any, optionIndex: number) => (
                                                        <label key={option?.id || optionIndex} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-gray-100 px-3 py-3">
                                                            <input
                                                                type="radio"
                                                                name={`radiogroup_-${index}`}
                                                                checked={item?.selectedAnswer === option?.option}
                                                                onChange={() => handleFinalAnswerChange(index, option?.option)}
                                                                className="h-5 w-5 accent-blue-500" />
                                                            <span className="font-normal">{option?.option}</span>
                                                        </label>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }

                                <div className='flex justify-center mt-4'>
                                    <Button
                                        className='bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                                        variant="default"
                                        onClick={checkFinalAnswers}
                                    >
                                        Submit
                                    </Button>
                                </div>

                                <Dialog open={isShow} onOpenChange={setIsShow}>
                                    <DialogContent
                                        showCloseButton={false}
                                        className="max-w-md rounded-[28px] border-0 bg-white p-0 shadow-[0_24px_80px_rgba(17,24,39,0.22)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                                    >
                                        <div className="relative w-full p-8 text-center">
                                            <DialogClose asChild>
                                                <button
                                                    type="button"
                                                    className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                                                    aria-label="Close"
                                                >
                                                    <span className="text-xl leading-none">×</span>
                                                </button>
                                            </DialogClose>

                                            <div className="mb-5 flex justify-center">
                                                {examResultType === "pass" ? (
                                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
                                                        <CheckCircle2 className="h-12 w-12 text-emerald-600" strokeWidth={2.5} />
                                                    </div>
                                                ) : (
                                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 ring-8 ring-red-50">
                                                        <XCircle className="h-12 w-12 text-red-600" strokeWidth={2.5} />
                                                    </div>
                                                )}
                                            </div>

                                            <DialogHeader className="mb-3 text-center">
                                                <DialogTitle className="text-3xl text-center font-bold uppercase tracking-tight text-slate-900">
                                                    {examResultType === "pass" ? "Congratulations!" : "Exam Result"}
                                                </DialogTitle>
                                            </DialogHeader>

                                            <DialogDescription className="text-base leading-7 text-slate-700">
                                                {examResultType === "pass"
                                                    ? `You passed the exam with ${totalPercentage}% and met the ${passPercentage}% requirement.`
                                                    : `You scored ${totalPercentage}% and need at least ${passPercentage}% to pass this exam.`}
                                            </DialogDescription>

                                            <DialogClose asChild>
                                                <Button className="mt-6 w-full rounded-xl bg-[#0b2d5c] text-white hover:bg-[#0d3a75]">
                                                    Close
                                                </Button>
                                            </DialogClose>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {err && (
                                    <p className="mt-3 text-center text-sm font-medium text-red-600">{err}</p>
                                )}

                                {showSubmitConfirm && (
                                    <p className="mt-3 text-center text-sm font-medium text-green-600">
                                        All questions answered. Ready to submit.
                                    </p>
                                )}
                            </div>
                        </section>
                    </TabsContent>
                    <TabsContent value="faq" className=' mb-4 '>
                        <section className="mt-8bg-gray-100 px-6 py-12 md:px-10">
                            <div className="mx-auto max-w-6xl">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
                                    <p className="mt-2 text-base text-slate-600">Find answers to common questions below.</p>
                                </div>

                                <div className="mx-auto mt-10 max-w-[980px] space-y-4">
                                    <Accordion type="single" collapsible className="space-y-4">
                                        {faqItems.map((item, index) => (
                                            <AccordionItem
                                                key={index}
                                                value={`faq-item-${index}`}
                                                className="rounded-xl border border-gray-300 bg-white px-4 shadow-sm"
                                            >
                                                <AccordionTrigger className="py-4 text-xl font-bold text-slate-900 hover:no-underline">
                                                    {item.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-slate-600">
                                                    {item.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        </section>

                        <section className="mt-8 border border-gray-200 bg-gray-100 p-6 shadow-sm md:p-10">
                            <div className="grid items-center gap-8 lg:grid-cols-2">
                                <div>
                                    <h2 className="text-4xl font-bold leading-tight text-slate-900">We&apos;re here to help</h2>
                                    <p className="mt-4 max-w-xl leading-relaxed text-slate-700">
                                        <strong>Questions? Feedback?</strong> Our ears and eyes are always open. We are closed on <strong>US Holidays and weekends</strong>, but don&apos;t worry, our bots don&apos;t sleep.
                                    </p>

                                    <form className="mt-6 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="h-12 w-full rounded-full border border-gray-300 bg-white px-5 text-lg text-slate-700 outline-none transition focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            className="h-12 rounded-full bg-indigo-600 px-8 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                        >
                                            Submit
                                        </button>
                                    </form>
                                </div>

                                <div className="relative mx-auto w-full">
                                    <div className="absolute h-[400px] w-[400px] inset-8 rounded-full bg-indigo-200/70"></div>
                                    <img
                                        src={"/assets/images/banner-4.png"}
                                        alt="Customer support illustration"
                                        className="relative z-10 w-full object-contain"
                                    />
                                </div>
                            </div>
                        </section>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ViewWebinar