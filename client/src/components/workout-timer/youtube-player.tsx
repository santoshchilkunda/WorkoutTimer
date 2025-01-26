import { useState } from "react";
import YouTube from "react-youtube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface YouTubePlayerProps {
  onPlayerReady: (player: any) => void;
}

// Helper function to extract video ID from YouTube URL
function extractVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function YouTubePlayer({ onPlayerReady }: YouTubePlayerProps) {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const extracted = extractVideoId(url);
    if (extracted) {
      setVideoId(extracted);
    } else {
      console.error("Invalid YouTube URL");
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter YouTube URL for workout music"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Load</Button>
      </form>

      {videoId && (
        <div className="hidden">
          <YouTube
            videoId={videoId}
            opts={{
              playerVars: {
                autoplay: 1,
                controls: 0,
              },
            }}
            onReady={(event) => onPlayerReady(event.target)}
          />
        </div>
      )}
    </div>
  );
}