import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
