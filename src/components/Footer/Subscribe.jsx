import { useState } from "react"

const Subscribe = () => {
  const [email, setemail] = useState("")
  
  const subscribe = async(e) => {
    e.preventDefault()
    console.log(email)
    await fetch("https://encouraging-scarlet.cmd.outerbase.io/newsub", {
        'method': 'POST',
        'headers': {
          'content-type': 'application/json'
        },
        'body': JSON.stringify({
          email: email, 
          createdAt : new Date(), 
          subscribeTo: "meal"
        })
      })
  }

  

  return (
    <div className="w-[80%] md:min-h-[15vh] mx-auto bg-custom-black px-5 py-10 flex-col md:flex-row flex justify-evenly items-center rounded-2xl text-white">
        <div className="text-4xl">
        Conquer our<br/>Challenge
        </div>
        <form onSubmit={(e) => subscribe(e)} className="bg-white  px-5 py-4 rounded-lg">
            <input type="text" value={email} name="email" id="email" placeholder="Enter your email" className="h-[5vh] text-lg active:outline-none focus:outline-none text-black" onChange={(e) => {
              setemail(e.target.value)
            }} />
            <button type="submit" className="bg-light-green text-black text-xl px-5 py-4 rounded-md text-center">
                Subscribe Now
            </button>
        </form>
    </div>
  )
}

export default Subscribe
