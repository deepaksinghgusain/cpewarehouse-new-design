'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getHeader } from '@/services/common'
import { getAllFinalExamQuestion } from '@/services/exam'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type FinalQuestion = {
    id?: string | number
    title?: string
    options?: Array<{ id?: string | number; option?: string }>
}

type ExamResultType = 'pass' | 'fail' | ''

type FinalExamApiResponse = {
    exams?: {
        data?: Array<{
            id?: string | number
            attributes?: { questions?: FinalQuestion[] }
        }>
    }
}

type FinalExamProps = { slug: string }

type ExamApiResponse = {
    error?: { message?: string }
    data?: { attributes?: { score?: number; totalScore?: number } }
}

export function FinalExam({ slug }: FinalExamProps) {
    const [questions, setQuestions] = useState<FinalQuestion[]>([])
    const [examId, setExamId] = useState('')
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [error, setError] = useState('')
    const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false)
    const [isResultOpen, setIsResultOpen] = useState(false)
    const [examResultType, setExamResultType] = useState<ExamResultType>('')
    const [totalPercentage, setTotalPercentage] = useState('0')
    const [passPercentage, setPassPercentage] = useState(70)

    useEffect(() => {
        if (!slug) return

        const loadExam = async () => {
            try {
                const response = await getAllFinalExamQuestion(slug) as FinalExamApiResponse
                const exam = response.exams?.data?.[0]
                const loadedQuestions = exam?.attributes?.questions || []
                setExamId(String(exam?.id || ''))
                setQuestions(loadedQuestions)
                setAnswers({})
            } catch (loadError) {
                console.error('Unable to load final exam questions', loadError)
                setQuestions([])
                setExamId('')
            }
        }

        void loadExam()
    }, [slug])

    const handleAnswerChange = (questionIndex: number, optionValue: string) => {
        setAnswers((previous) => ({ ...previous, [questionIndex]: optionValue }))
    }

    const submitExam = async (submittedAnswers: Array<{ question: string; answer: string }>) => {
        setError('')
        setShowSubmitConfirmation(true)

        try {
            const todayDate = new Date().toISOString().split('T')[0]
            const headerResponse = await getHeader()
            const requiredPassPercentage = headerResponse?.data?.data?.attributes?.examPassPercentage || 70
            setPassPercentage(requiredPassPercentage)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-exams`, {
                method: 'POST',
                body: JSON.stringify({ data: { answerJson: submittedAnswers, exam: examId, startedOn: todayDate, endedOn: todayDate } }),
                headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}`, 'content-type': 'application/json' },
            })
            const result = await response.json() as ExamApiResponse

            if (result.error?.message?.toLowerCase().includes('already given the exam')) {
                setError('You have already submitted the exam. Multiple attempts are not allowed.')
                return
            }

            const score = Number(result.data?.attributes?.score || 0)
            const total = Number(result.data?.attributes?.totalScore || 0)
            if (!result.data || total <= 0) return

            const percentage = ((score * 100) / total).toFixed(2)
            setTotalPercentage(percentage)
            setExamResultType(Number(percentage) >= requiredPassPercentage ? 'pass' : 'fail')
            setIsResultOpen(true)
        } catch {
            setError('Unable to submit the exam right now. Please try again.')
        }
    }

    const isSubmitDisabled = questions.length === 0 || questions.some((_, index) => !answers[index]?.trim())

    const handleSubmit = () => {
        const submittedAnswers = questions.map((question, index) => ({ question: question.title?.trim() || '', answer: answers[index]?.trim() || '' }))
        if (submittedAnswers.some((answer) => !answer.question || !answer.answer)) {
            setError('Make sure you have answered each question')
            setShowSubmitConfirmation(false)
            return
        }
        void submitExam(submittedAnswers)
    }

    return (
        <section className="mt-8 border-t border-gray-300 px-4 pt-2 pb-8 md:px-6">
            <div className="mx-auto">
                <div className="text-center"><h2 className="text-2xl font-bold text-slate-900">Final Exam</h2><p className="mt-2 font-semibold text-slate-800">{questions.length} Questions</p></div>
                {questions.map((question, index) => <div className="mt-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm" key={question.id || index}><p className="font-semibold leading-snug text-slate-900">{index + 1}. {question.title}</p><div className="mt-4 space-y-3">{question.options?.map((option, optionIndex) => <label key={option.id || optionIndex} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-gray-100 px-3 py-3"><input type="radio" name={`radiogroup_-${index}`} checked={answers[index] === option.option} onChange={() => handleAnswerChange(index, option.option || '')} className="h-5 w-5 accent-blue-500" /><span className="font-normal">{option.option}</span></label>)}</div></div>)}
                <div className="mt-4 flex justify-center"><Button className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500" onClick={handleSubmit} disabled={isSubmitDisabled}>Submit</Button></div>
                {error && <p className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>}
                {showSubmitConfirmation && <p className="mt-3 text-center text-sm font-medium text-green-600">All questions answered. Ready to submit.</p>}

                <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}><DialogContent showCloseButton={false} className="max-w-md rounded-[28px] border-0 bg-white p-0 shadow-[0_24px_80px_rgba(17,24,39,0.22)]"><div className="relative w-full p-8 text-center"><DialogClose asChild><button type="button" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700" aria-label="Close"><span className="text-xl leading-none">×</span></button></DialogClose><div className="mb-5 flex justify-center">{examResultType === 'pass' ? <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50"><CheckCircle2 className="h-12 w-12 text-emerald-600" /></div> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 ring-8 ring-red-50"><XCircle className="h-12 w-12 text-red-600" /></div>}</div><DialogHeader className="mb-3 text-center"><DialogTitle className="text-center text-3xl font-bold uppercase tracking-tight text-slate-900">{examResultType === 'pass' ? 'Congratulations!' : 'Exam Result'}</DialogTitle></DialogHeader><DialogDescription className="text-base leading-7 text-slate-700">{examResultType === 'pass' ? `You passed the exam with ${totalPercentage}% and met the ${passPercentage}% requirement.` : `You scored ${totalPercentage}% and need at least ${passPercentage}% to pass this exam.`}</DialogDescription><DialogClose asChild><Button className="mt-6 w-full rounded-xl bg-[#0b2d5c] text-white hover:bg-[#0d3a75]">Close</Button></DialogClose></div></DialogContent></Dialog>
            </div>
        </section>
    )
}
