"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <div className="container text-center">
      <h1 className="mt-5 text-primary">¡Bootstrap está funcionando!</h1>
      <button className="btn btn-success">Haz clic aquí</button>
    </div>
  );
}
