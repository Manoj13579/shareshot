import homeImg from "@/assets/images/homeimg.jpg"
import { useNavigate } from "react-router"

const Home = () => {

const navigate = useNavigate()
  return (
    <div className=" h-[92vh] flex items-center justify-center gap-4 bg-slate-950 p-4">
      <img
      src={homeImg}
      alt="home image"
      className="hidden md:block"
      />
      <div className="text-cyan-600 text-4xl cursor-pointer" onClick={() => navigate('/user-dashboard-layout')}>
      Start Sharing →
      </div>
    </div>
  )
}

export default Home