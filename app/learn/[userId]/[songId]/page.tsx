'use client'
import * as React from 'react'


type LearnPageProps = {
        userId: string
        songId: string
}

export default function LearnPage({params}: any) {

    const {userId, songId} = React.use<LearnPageProps>(params);
    return (
        <div>
            <h1>Learn Page</h1>
            <p>User ID: {userId}</p>
            <p>Song ID: {songId}</p>
        </div>
    )
}