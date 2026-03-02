import React from 'react';
import Link from '@docusaurus/Link';

export default function Footer() {
  return (
    <footer className="sl-footer">
      <div className="sl-footerInner">
        <div className="sl-footerBrand">
          <div className="sl-footerBrandTitle">SaudiLab</div>
          <div className="sl-footerBrandText">
            A beginner-friendly platform for learning web basics, cyber security, and ethical security concepts.
          </div>
        </div>

        <div>
          <div className="sl-footerHeading">Social</div>
          <div className="sl-footerLinks">
            <a href="https://www.instagram.com/saudi.lab" target="_blank" rel="noopener noreferrer" className="sl-footerPill">
              Instagram
            </a>
            <a href="https://www.tiktok.com/@saudi.lab" target="_blank" rel="noopener noreferrer" className="sl-footerPill">
              TikTok
            </a>
          </div>
        </div>

        <div>
          <div className="sl-footerHeading">Legal</div>
          <div className="sl-footerLinks">
            <Link to="/contact" className="sl-footerPill">
              Contact
            </Link>
            <Link to="/privacy" className="sl-footerPill">
              Privacy
            </Link>
            <Link to="/terms" className="sl-footerPill">
              Terms
            </Link>
          </div>
        </div>

        <div>
          <div className="sl-footerHeading">Support</div>
          <div className="sl-footerLinks">
            <a href="https://example.com/support" target="_blank" rel="noopener noreferrer" className="sl-footerPill">
              Support SaudiLab
            </a>
          </div>
        </div>
      </div>

      <div className="sl-footerBottom">
        © {new Date().getFullYear()} SaudiLab. All rights reserved.
      </div>
    </footer>
  );
}
