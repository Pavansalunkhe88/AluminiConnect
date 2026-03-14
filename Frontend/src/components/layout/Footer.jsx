import React from 'react';
import { Link } from 'react-router-dom';
import AlumniLogo from '../../assets/AluminiLogo.png';

const Footer = () => {
  return (
    <div className='relative bg-background'>
      {/* Footer */}
      <footer className="py-12 lg:pl-50 lg:pr-17 border-t border-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img className="h-6 w-6 text-primary" src={AlumniLogo} />
                <span className="font-semibold">AlumniConnect</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting students, alumni, and faculty across generations.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Features</h4>
              <div className="space-y-2 text-sm text-muted-foreground flex flex-col">
                <Link to="/login" className="hover:text-primary transition-colors">Alumni Directory</Link>
                <Link to="/login" className="hover:text-primary transition-colors">Messaging</Link>
                <Link to="/login" className="hover:text-primary transition-colors">Notifications</Link>
                <Link to="/login" className="hover:text-primary transition-colors">Profile Management</Link>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Community</h4>
              <div className="space-y-2 text-sm text-muted-foreground flex flex-col">
                <Link to="/register" className="hover:text-primary transition-colors">Students</Link>
                <Link to="/register" className="hover:text-primary transition-colors">Alumni</Link>
                <Link to="/register" className="hover:text-primary transition-colors">Faculty</Link>
                <Link to="/login" className="hover:text-primary transition-colors">Administrators</Link>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground flex flex-col">
                <Link to="/help" className="hover:text-primary transition-colors">Help Center</Link>
                <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>

          <div className=" mt-8 pt-8 text-center text-sm text-muted-foreground lg:pr-17">
            <p>&copy; 2026 AlumniConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
