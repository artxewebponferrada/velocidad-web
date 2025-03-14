export function Footer() {
  return (
    <footer className="py-8 border-t bg-background/50 backdrop-blur-sm">
      <div className="text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Hecho con ❤️ por{" "}
          <a
            href="https://artxeweb.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary hover:underline transition-colors"
          >
            Artxeweb
          </a>
        </p>
      </div>
    </footer>
  );
}
