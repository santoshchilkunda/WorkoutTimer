import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import YouTube from "react-youtube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Play, Pause } from "lucide-react";

export interface YouTubePlayerRef {
  reset: () => void;
}

interface YouTubePlayerProps {
  onPlayerReady: (player: any) => void;
}

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(({ onPlayerReady }, ref) => {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setUrl("");
      setVideoId(null);
      setIsPlaying(false);
      if (player) {
        try {
          player.stopVideo();
        } catch (error) {
          console.error('Error stopping video:', error);
        }
      }
    }
  }));

  // Helper function to extract video ID from YouTube URL
  function extractVideoId(url: string) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  }

  useEffect(() => {
    // Cleanup function
    return () => {
      if (player) {
        try {
          player.stopVideo();
        } catch (error) {
          console.error('Error stopping video:', error);
        }
      }
    };
  }, [player]);

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
    try {
      const ytPlayer = event.target;
      setPlayer(ytPlayer);

      // Ensure player is unmuted and volume is at max
      ytPlayer.unMute();
      ytPlayer.setVolume(100);

      // Start playing
      ytPlayer.playVideo();
      onPlayerReady(ytPlayer);
      setLoading(false);
      setIsPlaying(true);

      // Log player state for debugging
      console.log('YouTube Player State:', ytPlayer.getPlayerState());
    } catch (error) {
      console.error('YouTube player initialization error:', error);
      handleError();
    }
  };

  const handleError = () => {
    setLoading(false);
    toast({
      variant: "destructive",
      title: "Playback Error",
      description: "Unable to play this video. Please try another URL."
    });
    setVideoId(null);
    setIsPlaying(false);
  };

  const handleStateChange = (event: any) => {
    // Update playing state based on player state
    const playerState = event.data;
    setIsPlaying(playerState === 1); // 1 is playing state
  };

  const togglePlayPause = () => {
    if (!player) return;

    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.unMute();
        player.setVolume(100);
        player.playVideo();
      }
    } catch (error) {
      console.error('YouTube player control error:', error);
      handleError();
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
        {videoId ? (
          <Button 
            type="button"
            onClick={togglePlayPause}
            disabled={loading || !player}
            variant="outline"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        ) : (
          <Button type="submit" disabled={loading}>
            Add Music
          </Button>
        )}
      </form>

      {videoId && (
        <div className="relative">
          <YouTube
            videoId={videoId}
            opts={{
              height: '200',
              width: '100%',
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1,
                origin: window.location.origin
              },
            }}
            onReady={handleReady}
            onStateChange={handleStateChange}
            onError={handleError}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
});

YouTubePlayer.displayName = "YouTubePlayer";