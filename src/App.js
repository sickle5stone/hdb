import logo from "./logo.svg";
import "./App.css";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import { areas } from "./constants/utils";
import _ from "lodash";

const getData = async (area) => {
  const data = await axios.get(
    `https://data.gov.sg/api/action/datastore_search?resource_id=f1765b54-a209-4718-8d38-a39237f502b3&q=${area}&limit=5`
  );

  return data.data.result.records;
};

const renderTable = (rowData) => {
  if (rowData === undefined && rowData?.length < 1) {
    return false;
  }

  const renderColumns = () => {
    const columns = ["Area", "Flat Type", "Floor Area (sqm)", "Lease Remaining", "Street Name", "Price"];

    return columns.map((column) => {
      return <TableCell>{column}</TableCell>;
    });
  };

  const renderRows = () => {
    return rowData.map((record) => {
      return (
        <TableRow
          key={record._id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {record.town}
          </TableCell>
          <TableCell component="th" scope="row">
            {record.flat_type}
          </TableCell>
          <TableCell component="th" scope="row">
            {record.floor_area_sqm}
          </TableCell>
          <TableCell component="th" scope="row">
            {record.remaining_lease}
          </TableCell>
          <TableCell component="th" scope="row">
            {record.street_name}
          </TableCell>
          <TableCell>{record.resale_price}</TableCell>
          
        </TableRow>
      );
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>{renderColumns()}</TableRow>
        </TableHead>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </TableContainer>
  );
};

function App() {
  const [rowData, setRowData] = React.useState([]);

  // React.useEffect(() => {
  //     if (rowData.length < 1){
  //       setRowData(getData())
  //     }
  //     console.log(rowData)
  //     console.log(getData())
  //   }, [rowData]);
  
  const updateRowData = (searchArea) => {
    getData(searchArea).then((res) => {
      if (res.length > 0) {
        setRowData(res);
      }
    });
  }


  const handleChange = (e, val) => {
    updateRowData(val);
  };

  return (
    <div className="App">
      <Autocomplete
        options={areas}
        renderInput={(params) => <TextField {...params} label="Area" />}
        onChange={handleChange}
      ></Autocomplete>
      {renderTable(rowData)}
    </div>
  );
}

export default App;
