import { useState } from "react";
import YouTube from "react-youtube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const extracted = extractVideoId(url);
    if (extracted) {
      setLoading(true);
      setVideoId(extracted);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL"
      });
    }
  };

  const handleReady = (event: any) => {
    // Ensure video is muted initially to allow autoplay
    event.target.mute();
    // Start playing
    event.target.playVideo();
    // After playback starts, unmute and adjust volume
    setTimeout(() => {
      event.target.unMute();
      onPlayerReady(event.target);
      setLoading(false);
    }, 100);
  };

  const handleError = () => {
    setLoading(false);
    toast({
      variant: "destructive",
      title: "Playback Error",
      description: "Unable to play this video. Please try another URL."
    });
    setVideoId(null);
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
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Load"}
        </Button>
      </form>

      {videoId && (
        <div aria-hidden className="hidden">
          <YouTube
            videoId={videoId}
            opts={{
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1
              },
            }}
            onReady={handleReady}
            onError={handleError}
          />
        </div>
      )}
    </div>
  );
}