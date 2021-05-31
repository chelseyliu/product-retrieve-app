import React, { Component } from "react";
import axios from 'axios';
import cheerio from 'cheerio'
import { Card} from 'semantic-ui-react'
import "./Search.css";



class Search extends Component {
  state = {
    url: "",
    title: "",
    price: "",
    img_src: "",
  };

  handleOnChange = event => {
    this.setState({ url: event.target.value });
  };

  handleSearch = () => {
    this.fetchPage(this.state.url);
  };

  fetchPage = url => {
    console.log("fetching page: " + url);
    axios
      .get(url)
      .then((response) => {
        const html = response.data;

        // Load response into a Cheerio instance
        const $ = cheerio.load(html);

        // 1. Parse html and get title.
        let title = $('h4').first().text();

        // 2. Parse html and get image source.
        var img_src;
        $("li").each(function (idx, ele) {
          if (ele.attribs.class === 'slide selected') {
            img_src = $(ele).find('img').first().attr('src');
          }
        });

        // 3. Parse html and get price.
        var price;
        $("div").each(function (idx, ele) {
          if (ele.attribs.class === 'mt-1 text-gray-600') {
            let content = $(ele).text();
            price = content.substring(content.indexOf("$"));
          }
        });

        console.log("Title: " + title);
        console.log("image src: " + img_src);
        console.log("price: " + price);
        this.setState({ title: title });
        this.setState({ price: price });
        this.setState({ img_src: img_src });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div id="main">
        <h1>Welcome to the product retrieve app</h1>
        <input
          name="text"
          type="text"
          placeholder="Enter the product url here"
          onChange={event => this.handleOnChange(event)}
          value={this.state.searchValue}
        />
        <button onClick={this.handleSearch}>Search</button>
        {this.state.title ? (
          <Card
            image={this.state.img_src}
            header={this.state.title}
            meta={this.state.price}
            description='Check www.pallet9.com for more products :)'
            extra=""
          />
        ) : (
          <p>Try retrieve for a product by url</p>
        )}
      </div>
    );
  }
}

export default Search;