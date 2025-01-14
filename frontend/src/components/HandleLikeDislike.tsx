import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";

const HandleLikeDislike = ({
  isLoggedIn,
  isLiked,
  handleLikeDislike,
}: {
  isLoggedIn: boolean;
  isLiked: boolean | null;
  handleLikeDislike: (isLike: boolean) => void;
}) => {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {isLoggedIn ? (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => handleLikeDislike(true)}>
                  {isLiked === true ? <AiFillLike /> : <AiOutlineLike />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => handleLikeDislike(false)}>
                  {isLiked === false ? <AiFillDislike /> : <AiOutlineDislike />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dislike</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ) : (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <AiOutlineLike />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Please Login to Like</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <AiOutlineDislike />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Please Login to Dislike</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
};

export default HandleLikeDislike;
