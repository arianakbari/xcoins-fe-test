import React from "react";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import useExchange from "./useExchange";
import "./style.css";

function Exchange() {
  const {
    state,
    showErrorDialog,
    setShowErrorDialog,
    getFromCurrencies,
    getToCurrencies,
    fromValueOnChange,
    fromCurrencyOnChange,
    toCurrencyOnChange,
    exchangeBtnOnClick,
    swapBtnOnClick,
  } = useExchange();
  return (
    <div className="app">
      <Dialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Limit Exceeded!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can't exchange money more than your wallet amount!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowErrorDialog(false)}
            autoFocus
            color="primary"
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <AppBar id="app-bar">Exchangify!</AppBar>
      <Container maxWidth="md" id="container">
        <Card
          sx={{ minWidth: 340, border: "0.5px solid lightgray" }}
          variant="outlined"
        >
          <CardContent sx={{ padding: "0 !important" }}>
            <Grid container direction="column" sx={{ position: "relative" }}>
              <Grid
                container
                item
                sx={{ justifyContent: "space-between", height: 150, p: 3 }}
              >
                <Grid
                  xs={6}
                  item
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                  }}
                >
                  <FormControl>
                    <Select
                      sx={{ width: 100, height: 40 }}
                      value={state.fromCurrency}
                      onChange={(e) => fromCurrencyOnChange(e.target.value)}
                    >
                      {getFromCurrencies().map((cur) => (
                        <MenuItem value={cur} key={cur}>
                          {cur}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="balance">
                    Balance:
                    <b>
                      {state.fromCurrency &&
                        ` ${(state.balances as any)[state.fromCurrency].sign}${
                          (state.balances as any)[state.fromCurrency].amount
                        }`}
                    </b>
                  </div>
                </Grid>
                <Grid
                  xs={6}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <FormControl>
                    <TextField
                      variant="standard"
                      sx={{ maxWidth: 75 }}
                      value={state.fromValue || ""}
                      type="number"
                      onChange={(e) => fromValueOnChange(e.target.value)}
                      disabled={!state.fromCurrency}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <div className="currency-rate">
                {state.rate
                  ? `1${(state.balances as any)[state.fromCurrency].sign} : ${
                      state.rate
                    }${(state.balances as any)[state.toCurrency].sign}`
                  : "-"}
              </div>
              <Grid
                container
                item
                sx={{
                  justifyContent: "space-between",
                  backgroundColor: "#f3f3f3",
                  height: 150,
                  p: 3,
                }}
              >
                <Grid
                  xs={6}
                  item
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                  }}
                >
                  <FormControl>
                    <Select
                      sx={{ width: 100, height: 40 }}
                      value={state.toCurrency}
                      onChange={(e) => toCurrencyOnChange(e.target.value)}
                      disabled={!state.fromCurrency}
                    >
                      {getToCurrencies().map((cur) => (
                        <MenuItem value={cur} key={cur}>
                          {cur}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="balance">
                    Balance:
                    <b>
                      {state.toCurrency &&
                        ` ${(state.balances as any)[state.toCurrency].sign}${
                          (state.balances as any)[state.toCurrency].amount
                        }`}
                    </b>
                  </div>
                </Grid>
                <Grid
                  xs={6}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <FormControl>
                    <TextField
                      variant="standard"
                      sx={{ maxWidth: 75 }}
                      value={state.toValue}
                      type="number"
                      disabled
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Grid container justifyContent="end" sx={{ mt: 2 }}>
          <Grid item xs={11} sm={3} md={2}>
            <Button
              color="primary"
              variant="contained"
              sx={{ width: "100%" }}
              startIcon={<CurrencyExchangeIcon />}
              onClick={exchangeBtnOnClick}
              disabled={
                !state.fromCurrency ||
                !state.fromValue ||
                !state.toCurrency ||
                !state.rate
              }
            >
              Exchange
            </Button>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              color="primary"
              sx={{ ml: 1 }}
              aria-label="Swap Currencies"
              disabled={!state.fromCurrency || !state.toCurrency}
              onClick={swapBtnOnClick}
            >
              <SwapVertIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Exchange;
