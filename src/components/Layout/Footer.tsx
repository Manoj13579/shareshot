

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          {/* Left Side */}
          <div>&copy; {new Date().getFullYear()} Shareshot. All rights reserved.</div>

          {/* Right Side */}
          <div className="flex space-x-4">
            <a href="/privacy" className="hover:text-gray-400">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-400">Terms of Service</a>
            <a href="/contact" className="hover:text-gray-400">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
