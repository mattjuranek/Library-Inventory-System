import Head from 'next/head'
import Link from 'next/link'

// https://github.com/fullcalendar/fullcalendar-examples/blob/main/next13/components/layout.js
export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Library Calendar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="favicon" href="/favicon.ico" />
      </Head>
      
      <div>
        {children}
      </div>
    </>
  )
}
