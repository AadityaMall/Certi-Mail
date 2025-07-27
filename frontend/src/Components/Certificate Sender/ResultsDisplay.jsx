import {useEffect} from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, resetReducers } from "../../Redux/action";

const ResultsDisplay = ({ response }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { summary, detailedResults, message } = response;

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  const columns = [
    { field: "id", headerName: "SR.NO", width: 50 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "certificateStatus",
      headerName: "Certificate Status",
      cellClassName: (params) => {
        return params.row["certificateStatus"] === "Generated"
          ? "text-success"
          : "text-danger";
      },
    },
    {
      field: "emailStatus",
      headerName: "Email Status",
      cellClassName: (params) => {
        return params.row["emailStatus"] === "Success"
          ? "text-success"
          : "text-danger";
      },
    },
  ];

  const rows = [];
  detailedResults &&
    detailedResults.forEach((element, index) => {
      rows.push({
        id: index,
        name: element.Name,
        email: element.Email,
        certificateStatus: element.certificateStatus,
        emailStatus: element.emailStatus,
        error: element.ErrorDetails || "None",
      });
    });

  function CustomToolbar() {
    return (
      <GridToolbarContainer className="flex justify-end p-2 bg-gray-50 border-b border-gray-200">
        <GridToolbarExport
          csvOptions={{
            fileName: "certificate_send_results",
            delimiter: ",",
            utf8WithBom: true,
          }}
          printOptions={{ disableToolbarButton: true }} // Disable print option if you only want CSV
        />
      </GridToolbarContainer>
    );
  }

  // Also, add a check for detailedResults before rendering the DataGrid if it might be empty
  if (!detailedResults || detailedResults.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto font-sans bg-white rounded-xl shadow-2xl text-center">
        <h2 className="text-center text-gray-800 mb-8 text-4xl font-extrabold pb-4">
          No Detailed Results Available
        </h2>
        <p className="text-gray-600 mb-6">
          It seems no individual processing details were returned.
        </p>
        <button
          onClick={() => {
            dispatch(clearErrors());
            dispatch(resetReducers());
          }}
          className="px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 mt-5 max-w-6xl w-full mx-auto font-sans bg-white rounded-xl shadow-2xl">
      <h2 className="text-center text-gray-800 mb-8 text-4xl font-extrabold border-b-4 border-blue-500 pb-4">
        🚀 Processing Results
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10 flex flex-wrap justify-around items-center gap-6 shadow-md">
        <div className="text-center flex-1 min-w-[180px]">
          <h3 className="text-gray-700 mb-2 text-lg">Total Processed</h3>
          <p className="text-5xl font-bold text-blue-600">
            {summary.totalRowsProcessed}
          </p>
        </div>
        <div className="text-center flex-1 min-w-[180px]">
          <h3 className="text-gray-700 mb-2 text-lg">Emails Sent</h3>
          <p className="text-5xl font-bold text-green-600">
            {summary.successfulEmailsSent}
          </p>
        </div>
        <div className="text-center flex-1 min-w-[180px]">
          <h3 className="text-gray-700 mb-2 text-lg">Failed Attempts</h3>
          <p className="text-5xl font-bold text-red-600">
            {summary.failedAttempts}
          </p>
        </div>
      </div>

      <h3 className="text-gray-800 mb-6 text-2xl font-semibold border-b border-gray-200 pb-3">
        Detailed Recipient Status:
      </h3>

      <div className="h-[500px] w-full min-w-[550px] mb-8 shadow-lg rounded-lg overflow-hidden">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          slots={{
            toolbar: CustomToolbar, // Use the custom toolbar here
          }}
          sx={{
            boxShadow: "none",
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
              color: "#334155",
              fontSize: "1rem",
              fontWeight: "600",
              borderBottom: "2px solid #3b82f6",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.95rem",
              color: "#475569",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#eff6fd",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #e2e8f0",
            },
            "& .MuiDataGrid-virtualScrollerContent": {
              scrollbarWidth: "thin",
              scrollbarColor: "#94a3b8 #f1f5f9",
            },
            "& .MuiDataGrid-virtualScrollerContent::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "& .MuiDataGrid-virtualScrollerContent::-webkit-scrollbar-track": {
              background: "#f1f5f9",
              borderRadius: "10px",
            },
            "& .MuiDataGrid-virtualScrollerContent::-webkit-scrollbar-thumb": {
              backgroundColor: "#94a3b8",
              borderRadius: "10px",
              border: "2px solid #f1f5f9",
            },
          }}
        />
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => {
            dispatch(clearErrors());
            dispatch(resetReducers());
            navigate("/certificate-sender");
          }}
          className="px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Send More Certificates ✨
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
