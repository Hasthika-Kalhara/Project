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
      <h4>Tech Hotline: 0716942067</h4>
      <h4>Email: support@tech.mail</h4>
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
      <img
        src="https://img.icons8.com/?size=100&id=fdfLpA6fsXN2&format=png&color=000000"
        alt="Tiktok Icon"
        className='tiktok-icon' 
      />
      <img
        src="https://img.icons8.com/?size=100&id=9a46bTk3awwI&format=png&color=000000"
        alt="YT Icon"
        className='yt-icon' 
      />
    </div>

    <div className="products">
      <h2>Our Products</h2>
      <div className="product-scroll">
        <div className="product-square">Product 1</div>
        <div className="product-square">Product 2</div>
        <div className="product-square">Product 3</div>
        <div className="product-square">Product 4</div>
      </div>
    </div>
    </>
  )
}

