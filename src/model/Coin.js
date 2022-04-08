class Coin {
  constructor($, tr) {
    this.id = $(tr).find("td:nth-child(2)").text();
  }
}

export default Coin;
