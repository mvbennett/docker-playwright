export class OmniSearch {
  brand: string;
  environment: "staging" | "uat" | "preprod" | "prod";
  omniSearchEndpoint: string;
  omniResponse: any;

  constructor(
    brand: string,
    environment: "staging" | "uat" | "preprod" | "prod"
  ) {
    const apiEnvs = {
      staging: "https://womphealthapi.azurewebsites.net",
      uat: "https://womphealthapi.azurewebsites.net",
      prod: "https://womphealthapi.azurewebsites.net",
    };

    this.brand = brand;
    this.environment = environment;
    this.omniSearchEndpoint = `${apiEnvs[environment]}/api/OmniSearch`;
    this.fetchOmniSearch = this.fetchOmniSearch.bind(this);
  }

  public async fetchOmniSearch(
    type: "providers" | "locations",
    extraParams: Object
  ) {
    try {
      let paramsString = "";
      const params = {
        locations: type === "locations" ? "true" : "false",
        providers: type === "providers" ? "true" : "false",
        brand: this.brand,
        type: "search",
        skip: "0,0",
        top: "20",
        ...extraParams,
      };

      for (const [key, value] of Object.entries(params)) {
        paramsString += `${
          !paramsString.length ? "?" : "&"
        }${key}=${encodeURIComponent(value as string)}`;
      }

      const omniResponse = await fetch(
        `${this.omniSearchEndpoint}${paramsString}`
      ).then(async (res) => {
        if (res.status === 200 || res.ok) {
          const response = await res.json();
          if (response && !/(undefined|false|null)/.test(response)) {
            return response;
          }
        } else {
          throw new Error("Error fetching OmniSearch");
        }
      });

      return omniResponse;
    } catch (err) {
      console.error("Error fetching OmniSearch: ", err);
    }
  }
}

export class OmniSearchProvider extends OmniSearch {
  provider: any;
  extraParams: Object;

  constructor(
    brand: string,
    environment: "staging" | "uat" | "preprod" | "prod",
    extraParams: Object
  ) {
    super(brand, environment);
    this.extraParams = extraParams;
    this.init = this.init.bind(this);
  }

  public async init() {
    const omniResponse = await this.fetchOmniSearch(
      "providers",
      this.extraParams
    );
    // @ts-ignore
    if (omniResponse.results?.length) {
      // @ts-ignore
      const index = Math.floor(Math.random() * omniResponse.results.length) - 1;
      // @ts-ignore
      this.provider = omniResponse.results[index];
    }
  }
}

export class OmniSearchLocation extends OmniSearch {
  location: any;
  extraParams: Object;

  constructor(
    brand: string,
    environment: "staging" | "uat" | "preprod" | "prod",
    extraParams: Object
  ) {
    super(brand, environment);
    this.extraParams = extraParams;
    this.init = this.init.bind(this);
  }

  public async init() {
    const omniResponse = await this.fetchOmniSearch(
      "locations",
      this.extraParams
    );
    // @ts-ignore
    if (omniResponse.results?.length) {
      // @ts-ignore
      const index = Math.floor(Math.random() * omniResponse.results.length) - 1;
      // @ts-ignore
      this.location = omniResponse.results[index];
    }
  }
}
