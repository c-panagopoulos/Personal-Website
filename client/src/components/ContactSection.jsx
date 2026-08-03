export default function ContactSection() {
  return (
    <div id="contact" className="contact-section">
      <div className="contact-section__eyebrow">
        <span className="contact-section__eyebrow-label">END CREDITS</span>
        <span className="contact-section__eyebrow-rule" />
      </div>
      <h2 className="contact-section__title">Still scrolling?</h2>
      <p className="contact-section__body">
        A project idea, feedback on anything above, or an open role. I answer within a day.
      </p>
      <div className="contact-grid">
        <a className="contact-link" href="mailto:hello@panagopoulos.dev">
          <span className="contact-link__label">EMAIL</span>
          <span className="contact-link__value">say hello →</span>
        </a>
        <a className="contact-link" href="https://github.com/c-panagopoulos" target="_blank" rel="noreferrer">
          <span className="contact-link__label">GITHUB</span>
          <span className="contact-link__value">the source →</span>
        </a>
        <a className="contact-link" href="#contact">
          <span className="contact-link__label">LINKEDIN</span>
          <span className="contact-link__value">the formal one →</span>
        </a>
      </div>
      <div className="contact-footer">
        <span className="contact-footer__copy">© CHARALAMPOS PANAGOPOULOS · ATHENS</span>
        <span className="contact-footer__status">
          <span className="status-dot" />
          ALL SYSTEMS RUNNING
        </span>
      </div>
    </div>
  );
}
