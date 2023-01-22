import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useUniqueCategories } from "../../hooks/useUniqueCategories";
import { Video } from "../../types/Videos";
import { VideosForm } from "./components/VideosForm";
import { mapVideoToForm } from "./util";
import {
  initialState,
  useCreateVideoMutation,
  useGetAllCastMembersQuery,
  useGetAllGenresQuery,
} from "./VideoSlice";

export const VideosCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { data: genres } = useGetAllGenresQuery();
  const { data: castMembers } = useGetAllCastMembersQuery();
  const [createVideo, status] = useCreateVideoMutation();
  const [videoState, setVideoState] = useState<Video>(initialState);
  const [caregories] = useUniqueCategories(videoState, setVideoState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  console.log("selectedFiles", selectedFiles);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setVideoState((state) => ({ ...state, [name]: value }));
  }

  function handleAddFile(files: FileList | null) {
    if (!files) return;
    const filesArr = Array.from(files);
    setSelectedFiles([...selectedFiles, ...filesArr]);
  }

  function handleRemoveFile(file: File) {
    setSelectedFiles(selectedFiles.filter((f) => f !== file));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { id, ...payload } = mapVideoToForm(videoState);
    try {
      await createVideo(payload);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar(`Video created`, { variant: "success" });
    }

    if (status.isError) {
      enqueueSnackbar(`Error creating Video`, { variant: "error" });
    }
  }, [status, enqueueSnackbar]);

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create Video</Typography>
          </Box>
        </Box>

        <VideosForm
          video={videoState}
          genres={genres?.data}
          isLoading={status.isLoading}
          isDisabled={status.isLoading}
          categories={caregories}
          castMembers={castMembers?.data}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleAddFile={handleAddFile}
          handleRemoveFile={handleRemoveFile}
        />
      </Paper>
    </Box>
  );
};
