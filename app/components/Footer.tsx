const Footer = () => {
    return (
      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-light border-t border-backold flex items-center justify-center md:left-64 transition-all duration-300">
        <p className="text-dark text-sm">
          &copy; {new Date().getFullYear()} Tess Treasure - All Rights Reserved
        </p>
      </footer>
    );
  };
  
  export default Footer;