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
import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";
import { areas } from "./constants/utils";
import _, { update } from "lodash";

const getData = async (area, limit) => {
  const data = await axios.get(
    `https://data.gov.sg/api/action/datastore_search?resource_id=f1765b54-a209-4718-8d38-a39237f502b3&q=${area}&limit=${limit}&sort=month%20desc`
  );

  return data.data.result.records;
};

const renderTable = (rowData) => {
  if (rowData === undefined && rowData?.length < 1) {
    return false;
  }

  const renderColumns = () => {
    const columns = [
      "Txn Month",
      "Area",
      "Flat Type",
      "Floor Area (sqm)",
      "Lease Remaining",
      "Street Name",
      "Price",
    ];

    return columns.map((column) => {
      return <TableCell>{column}</TableCell>;
    });
  };

  const renderRows = () => {
    return rowData.map((record) => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "SGD"
      });


      return (
        <TableRow
          key={record._id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {record.month}
          </TableCell>
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
          <TableCell>{formatter.format(record.resale_price)}</TableCell>
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
  const [limit, setLimit] = React.useState(10);

  // React.useEffect(() => {
  //     if (rowData.length < 1){
  //       setRowData(getData())
  //     }
  //     console.log(rowData)
  //     console.log(getData())
  //   }, [rowData]);

  React.useEffect(() => {
    updateRowData("Central Area", 10);
  },[])

  const updateRowData = (searchArea, limit) => {
    getData(searchArea, limit).then((res) => {
      if (res.length > 0) {
        setRowData(res);
      }
    });
  };

  const handleChange = (e, val) => {
    updateRowData(val, limit);
  };

  const handleSelect = (e, val) => {
    setLimit(e.target.value || 10);
  };

  return (
    <div className="App">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Autocomplete
          style={{flex: 1}}
          options={areas}
          renderInput={(params) => <TextField {...params} label="Area" placeholder="Enter Area here"/>}
          onChange={handleChange}
        ></Autocomplete>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={limit}
          label="Limit"
          onChange={handleSelect}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </div>
      {renderTable(rowData)}
    </div>
  );
}

export default App;
