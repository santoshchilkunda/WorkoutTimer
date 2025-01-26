import { useState } from "react";
import YouTube from "react-youtube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import parse from "youtube-url-parser";

interface YouTubePlayerProps {
  onPlayerReady: (player: any) => void;
}

export function YouTubePlayer({ onPlayerReady }: YouTubePlayerProps) {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parse(url);
    if (parsed && typeof parsed === "string") {
      setVideoId(parsed);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Load</Button>
      </form>

      {videoId && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
              },
            }}
            onReady={(event) => onPlayerReady(event.target)}
            className="absolute inset-0"
          />
        </div>
      )}
    </div>
  );
}