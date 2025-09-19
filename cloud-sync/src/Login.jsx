import './Login.css'

export default function Login() 
{
  return(
    <>
    <div className="square">
      <h1>LOGIN</h1>
      <input type="text" placeholder='Username' />
      <input type="password" placeholder='Password' />
      <button>Submit</button>
      <button className='support-btn'>Contact Support</button>
    </div>

    <div className="socials">
      <h2>Contact Us</h2>
      <img
        src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000"
        alt="FB Icon"
        className='fb-icon' 
      />
      <img
        src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000"
        alt="Insta Icon"
        className='insta-icon' 
      />
    </div>
    </>
  )
}

