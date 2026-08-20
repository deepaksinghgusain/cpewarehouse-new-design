'use client'

import MuxPlayer from '@mux/mux-player-react'
import { updateUserCourseApi } from '@/services/course'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'

type VideoPlayerProps = Omit<React.ComponentPropsWithRef<typeof MuxPlayer>, 'playbackId' | 'onProgress' | 'onTimeUpdate' | 'onLoadedMetadata' | 'onPlay' | 'onPause' | 'onPlaying' | 'onEnded' | 'onSeeking'> & {
    playbackId: string
    initialTime?: number
    initialPercent?: string
    shouldPromptReview?: boolean
    onPromptReview?: () => void
    onProgress?: (currentTime: number, duration: number) => void
    userCourseId?: number | null
}

type MediaElement = HTMLMediaElement & { seeking?: boolean }

const getMediaElement = (node: React.ComponentRef<typeof MuxPlayer> | null): MediaElement | null => {
    if (!node) return null

    if (typeof node.currentTime === 'number' && typeof node.pause === 'function' && typeof node.play === 'function') {
        return node as unknown as MediaElement
    }

    const media = 'media' in node ? node.media : null
    if (media && typeof media.currentTime === 'number' && typeof media.pause === 'function' && typeof media.play === 'function') {
        return media as MediaElement
    }

    return null
}

export const VideoPlayer = React.forwardRef<React.ComponentRef<typeof MuxPlayer>, VideoPlayerProps>(function VideoPlayer(
    {
        playbackId,
        initialTime = 0,
        initialPercent = '0.00',
        shouldPromptReview = false,
        onPromptReview,
        onProgress,
        userCourseId,
        ...props
    },
    ref,
) {
    const playerRef = useRef<React.ComponentRef<typeof MuxPlayer>>(null)
    const lastTimeRef = useRef(initialTime)
    const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const isPausedRef = useRef(true)
    const [watchedTime, setWatchedTime] = useState(String(Math.floor(initialTime)))
    const [viewPercent, setViewPercent] = useState(initialPercent)

    useImperativeHandle(ref, () => playerRef.current!, [])

    const updateProgress = (currentTime: number, duration: number) => {
        const watched = Math.floor(currentTime).toFixed(0)
        setWatchedTime(watched)
        localStorage.setItem('videoWatchTime', watched)
        setViewPercent(duration > 0 ? ((Number(watched) * 100) / duration).toFixed(2) : '0.00')
        lastTimeRef.current = currentTime
        onProgress?.(currentTime, duration)
    }

    const syncCurrentTime = () => {
        const media = getMediaElement(playerRef.current)
        if (!media || isPausedRef.current) return

        const currentTime = Math.floor(media.currentTime).toFixed(0)
        localStorage.setItem('videoWatchTime', currentTime)
        setWatchedTime(currentTime)
        if (userCourseId) {
            void updateUserCourseApi(userCourseId, {
                data: { lastVideoView: Number(currentTime) },
            })
        }
    }

    const handleTimeUpdate = () => {
        const media = getMediaElement(playerRef.current)
        if (!media) return

        updateProgress(Number(media.currentTime || 0), Number(media.duration || 0))
        if (shouldPromptReview && !media.seeking) {
            media.pause()
            onPromptReview?.()
        }
    }

    const handleLoadedMetadata = () => {
        const media = getMediaElement(playerRef.current)
        if (!media) return

        const savedTime = Number(localStorage.getItem('videoWatchTime') || initialTime || 0)
        if (savedTime > 0 && Number(media.currentTime || 0) === 0) {
            media.currentTime = savedTime
            updateProgress(savedTime, Number(media.duration || 0))
        }
    }

    const handlePlay = () => {
        isPausedRef.current = false
        if (!syncIntervalRef.current) syncIntervalRef.current = setInterval(syncCurrentTime, 5000)
    }

    const handlePause = () => {
        isPausedRef.current = true
        syncCurrentTime()
        if (syncIntervalRef.current) {
            clearInterval(syncIntervalRef.current)
            syncIntervalRef.current = null
        }
    }

    const handlePlaying = () => {
        isPausedRef.current = false
        syncCurrentTime()
        if (!syncIntervalRef.current) syncIntervalRef.current = setInterval(syncCurrentTime, 5000)
    }

    const handleEnded = () => {
        const media = getMediaElement(playerRef.current)
        if (syncIntervalRef.current) {
            clearInterval(syncIntervalRef.current)
            syncIntervalRef.current = null
        }
        isPausedRef.current = true
        setViewPercent('100.00')
        lastTimeRef.current = 0
        if (media) onProgress?.(Number(media.duration || 0), Number(media.duration || 0))
    }

    const handleSeeking = () => {
        const media = getMediaElement(playerRef.current)
        if (!media) return

        if (Math.abs(media.currentTime - lastTimeRef.current) > 1) {
            media.currentTime = lastTimeRef.current
        }
    }

    useEffect(() => {
        const media = getMediaElement(playerRef.current)
        if (!media || initialTime <= 0 || Number(media.currentTime || 0) !== 0) return

        media.currentTime = initialTime
        lastTimeRef.current = initialTime
    }, [initialTime])

    useEffect(() => () => {
        if (syncIntervalRef.current) clearInterval(syncIntervalRef.current)
    }, [])

    return (
        <div className="relative h-full w-full">
            <MuxPlayer
                {...props}
                ref={(node) => {
                    playerRef.current = node
                    if (typeof ref === 'function') ref(node)
                    else if (ref) ref.current = node
                }}
                playbackId={playbackId}
                streamType="on-demand"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handlePlay}
                onPause={handlePause}
                onPlaying={handlePlaying}
                onEnded={handleEnded}
                onSeeking={handleSeeking}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '0.75rem',
                    ...props.style,
                }}
            />
            <div className="absolute bottom-5 right-6 rounded-md bg-black/60 px-3 py-2 text-xs text-white">
                Watched: {watchedTime}s ({viewPercent}%)
            </div>
        </div>
    )
})
