import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUniqueCategories } from "../../hooks/useUniqueCategories";
import { Video } from "../../types/Videos";
import { VideosForm } from "./components/VideosForm";
import { mapVideoToForm } from "./util";
import {
  initialState,
  useGetAllCastMembersQuery,
  useGetAllGenresQuery,
  useGetVideoQuery,
  useUpdateVideoMutation,
} from "./VideoSlice";

export function VideosEdit() {
  const id = useParams<{ id: string }>().id as string;
  const { enqueueSnackbar } = useSnackbar();
  const { data: genres } = useGetAllGenresQuery();
  const { data: castMembers } = useGetAllCastMembersQuery();
  const { data: video, isFetching } = useGetVideoQuery({ id });
  const [updateVideo, status] = useUpdateVideoMutation();
  const [videoState, setVideoState] = useState<Video>(initialState);
  const [categories, setCategories] = useUniqueCategories(
    videoState,
    setVideoState
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setVideoState((state) => ({ ...state, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateVideo(mapVideoToForm(videoState));
  }

  useEffect(() => {
    if (video) {
      setVideoState(video.data);
      setCategories(video.data.categories || []);
    }
  }, [video, setCategories]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar(`Video updated`, { variant: "success" });
    }

    if (status.isError) {
      enqueueSnackbar(`Error updating Video`, { variant: "error" });
    }
  }, [status, enqueueSnackbar]);

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Edit Video</Typography>
          </Box>
        </Box>

        <VideosForm
          video={videoState}
          isLoading={isFetching}
          isDisabled={isFetching}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          categories={categories}
          genres={genres?.data}
          castMembers={castMembers?.data}
        />
      </Paper>
    </Box>
  );
}
