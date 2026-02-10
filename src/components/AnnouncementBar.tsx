const AnnouncementBar = () => {
  return (
    <div className="bg-primary/10 border-b border-primary/20 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="mx-8 text-sm font-medium tracking-wide">
            <span className="text-foreground">FREE SHIPPING WORLDWIDE</span>
            <span className="mx-4 text-primary">🌎</span>
            <span className="mx-8 text-primary font-semibold">25% OFF SALE</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
