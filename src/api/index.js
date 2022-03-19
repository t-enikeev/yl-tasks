class API {
  /**
   *
   * @param services {Services}
   */
  constructor(services) {
    this.services = services;
    this.token = "";
  }

  async GET(url, options) {
    const res = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Token": this.token,
      },
    });
    return res.json();
  }

  async POST(url, options) {
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": this.token,
      },
    });
    return res.json();
  }

  async DELETE(url, options) {
    const res = await fetch(url, {
      ...options,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Token": this.token,
      },
    });
    return res.json();
  }
  async PUT(url, options) {
    const res = await fetch(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Token": this.token,
      },
    });
    return res.json();
  }

  setToken(token) {
    this.token = token;
  }
}

export default API;
