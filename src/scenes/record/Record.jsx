import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";

import RecordMain from "./sections/RecordMain";

import Spinner from "../../components/Spinner";
import CustomizedAccordions from "../../components/CustomizedAccordions";

import { getRecord } from "../../store/actions/records.actions";
import {
  setRecords,
  selectRecord,
  selectRecordsStatus,
  setRecordsStatus,
} from "../../store/slices/records.slice";

const Record = () => {
  const dispatch = useDispatch();
  const params = useParams();

  // THEME UTILS
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const recordsStatus = useSelector(selectRecordsStatus);
  const record = useSelector(selectRecord);

  useEffect(() => {
    dispatch(setRecords([]));
    dispatch(getRecord(params.id));
  }, [params]);

  useEffect(() => {
    if (recordsStatus === "success" || recordsStatus === "edited") {
      dispatch(setRecordsStatus(""));
    }
  }, [recordsStatus]);

  return recordsStatus === "loading" ? (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      rowGap={3}
      alignItems="center"
      height="75vh"
    >
      <Spinner size="75" />
      <Typography variant="h3">Cargando expediente...</Typography>
      <Typography variant="h6" color="secondary" textTransform="uppercase">
        Aguarde unos instantes
      </Typography>
    </Box>
  ) : (
    <Box
      display="grid"
      gridTemplateColumns="repeat(5, minmax(0, 1fr))"
      gridAutoRows="130px"
      gap="20px"
      p="0 15px"
    >
      <Box gridColumn="span 3" gridRow="span 2">
        <RecordMain />
      </Box>
      <Box
        gridColumn="span 2"
        gridRow="span 2"
        sx={{ height: "100%", bgcolor: "blue" }}
      >
        "RECORD PAGE"
      </Box>
      <Box
        gridColumn="span 5"
        gridRow="span 2"
        sx={{ height: "100%", bgcolor: "blue" }}
      >
        "RECORD PAGE"
      </Box>
    </Box>
  );
};

export default Record;
