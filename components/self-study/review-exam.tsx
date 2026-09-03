'use client'

import { getReviewExamQuestion } from '@/services/course'
import { useEffect, useState } from 'react'

export type ReviewOption = {
    id?: string | number
    value: string
    label: string
    isCorrect?: boolean
    hint?: string
}

export type ReviewQuestion = {
    id: string
    title: string
    hint?: string
    isMCQ: boolean
    supportsMultipleAnswers: boolean
    durationInminute?: string | number
    timestampSeconds: number
    options: ReviewOption[]
}

type AnswerResult = {
    isCorrect: boolean
    correctAnswer: string
    message: string
    hint?: string
}

type MediaElement = {
    currentTime: number
    duration?: number
    pause: () => void
    play: () => Promise<void>
    addEventListener: (type: string, listener: () => void) => void
    removeEventListener: (type: string, listener: () => void) => void
}

type ReviewExamProps = {
    slug: string
    videoRef: React.RefObject<unknown>
    onAllQuestionsCompleted?: () => void
}

type ReviewApiResponse = {
    reviewExams?: { data?: Array<{ attributes?: { questions?: unknown[] } }> }
    data?: { reviewExams?: { data?: Array<{ attributes?: { questions?: unknown[] } }> } }
}

const parseDurationToSeconds = (duration?: string | number | null) => {
    if (duration === null || duration === undefined || duration === '') return 0
    const value = String(duration).trim().replace(',', '.')
    const match = value.match(/^((\d+):)?(\d{1,2}):(\d{1,2})(?:\.(\d+))?$/)
    if (!match) return Number.isFinite(Number(value)) ? Number(value) : 0

    return (match[2] ? Number(match[2]) : 0) * 3600
        + Number(match[3]) * 60
        + Number(match[4])
        + (match[5] ? Number(`0.${match[5]}`) : 0)
}

const toRecord = (value: unknown): Record<string, unknown> => (
    value && typeof value === 'object' ? value as Record<string, unknown> : {}
)

const normalizeQuestion = (value: unknown, index: number): ReviewQuestion => {
    const question = toRecord(value)
    const rawOptions = Array.isArray(question.options) ? question.options : []
    const optionHints = rawOptions
        .map((rawOption) => {
            const option = toRecord(rawOption)
            const hint = option.hint ?? option.questionHint ?? option.helpText ?? option.explanation
            return typeof hint === 'string' ? hint.trim() : ''
        })
        .filter(Boolean)

    const options = rawOptions.map((rawOption, optionIndex) => {
        const option = toRecord(rawOption)
        const optionValue = option.value ?? option.option ?? option.label ?? option.text ?? option.answer ?? option.correctAnswer ?? `Option ${optionIndex + 1}`
        const optionLabel = option.label ?? option.option ?? option.text ?? option.value ?? option.answer ?? option.correctAnswer ?? `Option ${optionIndex + 1}`
        const isCorrect = option.isCorrect === true || option.correct === true || option.isAnswer === true || option.correctAnswer === true || option.answer === true || option.isCorrectAnswer === true
        const hint = typeof option.hint === 'string' ? option.hint.trim() : typeof option.questionHint === 'string' ? option.questionHint.trim() : ''

        return {
            id: String(option.id ?? option.optionId ?? option.value ?? optionIndex),
            label: String(optionLabel),
            value: String(optionValue),
            isCorrect,
            hint: hint || undefined,
        }
    })

    const questionHint = typeof question.hint === 'string'
        ? question.hint.trim()
        : typeof question.questionHint === 'string'
            ? question.questionHint.trim()
            : optionHints[0] || ''

    return {
        id: String(question.id ?? index),
        title: String(question.title ?? `Question ${index + 1}`),
        hint: questionHint || undefined,
        isMCQ: Boolean(question.isMCQ),
        supportsMultipleAnswers: Boolean(question.allowMultipleAnswers || question.multipleAnswers || question.supportsMultipleAnswers || question.multipleCorrectAnswers || Number(question.maxSelections ?? 0) > 1),
        durationInminute: String(question.durationInminute ?? '00:00'),
        timestampSeconds: parseDurationToSeconds(String(question.durationInminute ?? '00:00')),
        options,
    }
}

const getMediaElement = (ref: React.RefObject<unknown>): MediaElement | null => {
    const node = toRecord(ref.current)
    if (typeof node.currentTime === 'number' && typeof node.pause === 'function' && typeof node.play === 'function') {
        return node as unknown as MediaElement
    }

    const media = node.media
    if (media && typeof media === 'object') {
        const nestedMedia = toRecord(media)
        if (typeof nestedMedia.currentTime === 'number' && typeof nestedMedia.pause === 'function' && typeof nestedMedia.play === 'function') {
            return nestedMedia as unknown as MediaElement
        }
    }

    return null
}

const getSavedAnswers = () => {
    try {
        const saved = JSON.parse(localStorage.getItem('FinalAnswerList') || '[]')
        return Array.isArray(saved) ? saved.filter((item) => item?.question && item?.answer) : []
    } catch {
        return []
    }
}

export function ReviewExam({ slug, videoRef, onAllQuestionsCompleted }: ReviewExamProps) {
    const [questions, setQuestions] = useState<ReviewQuestion[]>([])
    const [currentQuestion, setCurrentQuestion] = useState<ReviewQuestion | null>(null)
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
    const [showResult, setShowResult] = useState(false)
    const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null)
    const [isReviewActive, setIsReviewActive] = useState(false)
    const [completedIds, setCompletedIds] = useState<string[]>([])

    useEffect(() => {
        if (!slug) return

        const loadQuestions = async () => {
            try {
                const response = await getReviewExamQuestion(slug) as ReviewApiResponse
                const reviewExams = response?.reviewExams?.data || response?.data?.reviewExams?.data || []
                const rawQuestions = reviewExams[0]?.attributes?.questions || []
                const mappedQuestions = rawQuestions
                    .map(normalizeQuestion)
                    .sort((first, second) => first.timestampSeconds - second.timestampSeconds)
                const savedTitles = new Set(getSavedAnswers().map((item) => String(item.question).trim()))
                const completed = mappedQuestions.filter((question) => savedTitles.has(question.title.trim())).map((question) => question.id)

                setQuestions(mappedQuestions)
                setCompletedIds(completed)
            } catch (error) {
                console.error('Unable to load review exam questions', error)
            }
        }

        void loadQuestions()
    }, [slug])

    useEffect(() => {
        const media = getMediaElement(videoRef)
        if (!media || questions.length === 0) return

        const openNextReviewQuestion = () => {
            if (isReviewActive) return
            const nextQuestion = questions.find((question) => !completedIds.includes(question.id) && media.currentTime >= question.timestampSeconds)
            if (!nextQuestion) return

            media.pause()
            media.currentTime = Math.min(media.currentTime, nextQuestion.timestampSeconds)
            setCurrentQuestion(nextQuestion)
            setSelectedAnswers([])
            setShowResult(false)
            setAnswerResult(null)
            setIsReviewActive(true)
        }

        const handleSeeking = () => {
            if (!currentQuestion || completedIds.includes(currentQuestion.id)) return
            if (media.currentTime > currentQuestion.timestampSeconds) {
                media.currentTime = currentQuestion.timestampSeconds
                media.pause()
            }
        }

        media.addEventListener('timeupdate', openNextReviewQuestion)
        media.addEventListener('pause', openNextReviewQuestion)
        media.addEventListener('seeked', openNextReviewQuestion)
        media.addEventListener('seeking', handleSeeking)
        return () => {
            media.removeEventListener('timeupdate', openNextReviewQuestion)
            media.removeEventListener('pause', openNextReviewQuestion)
            media.removeEventListener('seeked', openNextReviewQuestion)
            media.removeEventListener('seeking', handleSeeking)
        }
    }, [completedIds, currentQuestion, isReviewActive, questions, videoRef])

    if (!currentQuestion) return null

    const saveCorrectAnswer = (answers: string[]) => {
        const answer = answers.map((item) => item.trim()).filter(Boolean).join(', ')
        if (!answer) return
        const saved = getSavedAnswers().filter((item) => item.question !== currentQuestion.title)
        localStorage.setItem('FinalAnswerList', JSON.stringify([...saved, { question: currentQuestion.title, answer }]))
    }

    const evaluateAnswer = (answers: string[]) => {
        const correctAnswers = currentQuestion.options.filter((option) => option.isCorrect).map((option) => option.value.trim())
        const normalizedAnswers = answers.map((answer) => answer.trim())
        const isCorrect = currentQuestion.isMCQ && currentQuestion.supportsMultipleAnswers
            ? normalizedAnswers.length === correctAnswers.length && normalizedAnswers.every((answer) => correctAnswers.includes(answer))
            : normalizedAnswers[0] === correctAnswers[0]
        const answerHint = currentQuestion.options
            .filter((option) => normalizedAnswers.includes(option.value.trim()) && !option.isCorrect && option.hint)
            .map((option) => option.hint)
            .filter((hint, index, hints): hint is string => Boolean(hint) && hints.indexOf(hint) === index)
            .join(' ')

        setAnswerResult({
            isCorrect,
            correctAnswer: correctAnswers.join(', ') || 'N/A',
            message: isCorrect ? 'Your answer is correct.' : 'Your answer is incorrect.',
            hint: isCorrect ? undefined : answerHint || currentQuestion.hint,
        })
        setShowResult(true)
        if (isCorrect) saveCorrectAnswer(normalizedAnswers)
    }

    const handleOptionToggle = (optionValue: string) => {
        if (showResult) return
        if (!currentQuestion.isMCQ || !currentQuestion.supportsMultipleAnswers) {
            setSelectedAnswers([optionValue])
            evaluateAnswer([optionValue])
            return
        }
        setSelectedAnswers((previous) => previous.includes(optionValue)
            ? previous.filter((value) => value !== optionValue)
            : [...previous, optionValue])
    }

    const handleRetry = () => {
        setSelectedAnswers([])
        setAnswerResult(null)
        setShowResult(false)
    }

    const handleContinue = () => {
        if (!answerResult?.isCorrect) return
        const timestamp = currentQuestion.timestampSeconds
        const nextCompletedIds = completedIds.includes(currentQuestion.id)
            ? completedIds
            : [...completedIds, currentQuestion.id]

        const isLastReviewQuestion = questions.length > 0 && questions.every((question) => nextCompletedIds.includes(question.id))

        setCompletedIds(nextCompletedIds)
        setCurrentQuestion(null)
        setSelectedAnswers([])
        setAnswerResult(null)
        setShowResult(false)
        setIsReviewActive(false)

        if (isLastReviewQuestion) {
            onAllQuestionsCompleted?.()
        }

        const media = getMediaElement(videoRef)
        if (media) {
            media.currentTime = timestamp
            void media.play()
        }
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                    <div className="mb-4 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Review Question</p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">{currentQuestion.title}</h3>
                    </div>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, optionIndex) => {
                            const checked = selectedAnswers.includes(option.value)
                            const multipleChoice = currentQuestion.isMCQ && currentQuestion.supportsMultipleAnswers
                            return (
                                <label key={option.id || `${optionIndex}-${option.value}`} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${checked ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'} ${showResult ? 'cursor-not-allowed opacity-80' : ''}`}>
                                    <input type={multipleChoice ? 'checkbox' : 'radio'} name={`review-question-${currentQuestion.id}`} value={option.value} checked={checked} disabled={showResult} onChange={() => handleOptionToggle(option.value)} className="h-4 w-4 accent-blue-600" />
                                    <span className="text-base text-slate-700">{option.label}</span>
                                </label>
                            )
                        })}
                    </div>
                    {!showResult && <div className="mt-5 flex justify-end"><button type="button" onClick={() => evaluateAnswer(selectedAnswers)} disabled={selectedAnswers.length === 0} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">{currentQuestion.isMCQ && currentQuestion.supportsMultipleAnswers ? 'Check Answer' : 'Submit Answer'}</button></div>}
                </div>
            </div>

            {showResult && answerResult && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 text-center"><div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${answerResult.isCorrect ? 'bg-emerald-100' : 'bg-red-100'}`}><span className="text-3xl">{answerResult.isCorrect ? 'OK' : 'X'}</span></div><h3 className={`text-2xl font-bold ${answerResult.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>{answerResult.isCorrect ? 'Correct Answer' : 'Wrong Answer'}</h3></div><p className="text-center text-base text-slate-700">{answerResult.message}</p>{answerResult.hint && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><span className="font-semibold">Hint: </span>{answerResult.hint}</p>}<button type="button" onClick={answerResult.isCorrect ? handleContinue : handleRetry} className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-700">{answerResult.isCorrect ? 'Continue Video' : 'Try Again'}</button></div></div>}
        </>
    )
}
