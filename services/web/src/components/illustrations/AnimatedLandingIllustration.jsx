import LandingIllustration from "../../assets/illustrations/landing.svg?react";

// Static illustration component (animations removed)
export default function AnimatedLandingIllustration({ className }) {
  return (
    <div className={className} aria-label="LingoRush illustration">
      <LandingIllustration />
    </div>
  );
}
