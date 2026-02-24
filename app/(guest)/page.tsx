import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Home',
};

export default function page() {
  return (
    <div>
        <h1>Hello world</h1>
    </div>
  )
}
