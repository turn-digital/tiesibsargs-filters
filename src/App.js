import { useEffect, useState } from "react";
import Card from "./components/card/Card";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState();
  const [filters, setFilters] = useState();
  const [filteredData, setFilteredData] = useState(data);
  const [theme, setTheme] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const [checkboxTags, setCheckboxTags] = useState([]);

  useEffect(() => {
    axios("https://tiesibsargs.turn.lv/wp-json/ties-api/v1/resources").then(
      (res) => {
        setData(res.data);
        setFilteredData(res.data);
        console.log(res.data);
      }
    );
    axios(
      "https://tiesibsargs.turn.lv/wp-json/ties-api/v1/resources/filters"
    ).then((res) => {
      setFilters(res.data);
      console.log(res.data);
    });
  }, []);

  const applyFilters = (query, selectedThemeId, selectedCheckboxValues) => {
    let filteredArray = [...data];

    // Apply search filter
    if (query) {
      filteredArray = filteredArray.filter((item) => {
        return item.title.toLowerCase().includes(query.toLowerCase());
      });
    }

    // Apply theme filter
    if (selectedThemeId) {
      filteredArray = filteredArray.filter((obj) =>
        obj.linkedThemes.some(
          (theme) => parseInt(theme.id) === parseInt(selectedThemeId)
        )
      );
    }

    // Apply checkbox filter
    if (selectedCheckboxValues.length > 0) {
      filteredArray = filteredArray.filter((item) => {
        return selectedCheckboxValues.includes(item.categoryID);
      });
    }

    return filteredArray;
  };

  const filterBySearch = (event) => {
    setSearchQuery(event.target.value);
    const query = event.target.value;
    const filteredArray = applyFilters(query, theme, checkboxTags);
    setFilteredData(filteredArray);
  };

  const themeHandler = (themeId) => {
    const filteredArray = applyFilters(searchQuery, themeId, checkboxTags);
    setFilteredData(filteredArray);
  };

  const checkboxHandler = (event) => {
    const value = parseInt(event.target.value);
    const newCheckedTags = event.target.checked
      ? [...checkboxTags, value]
      : checkboxTags.filter((tag) => tag !== value);

    setCheckboxTags(newCheckedTags);

    if (newCheckedTags.length === 0) {
      setFilteredData(applyFilters(searchQuery, theme, []));
    } else {
      const filteredArray = applyFilters(searchQuery, theme, newCheckedTags);
      setFilteredData(filteredArray);
    }
  };

  return (
    <div className="App">
      <div style={{ display: "flex" }} key="';l">
        <div style={{ width: " 50vw", height: " 100vh" }} key="key2">
          <input
            placeholder="Search here"
            onChange={filterBySearch}
            style={{
              width: "250px",
              height: "50px",
              marginTop: "50px",
              marginLeft: "50px",
              marginBottom: "50px",
            }}
            key="ASDASDAS"
          ></input>
          {filters?.themes.map((theme) => {
            return (
              <div key={theme.id}>
                <button
                  style={{ minWidth: "200px" }}
                  onClick={() => {
                    setTheme(theme.id);
                    themeHandler(theme.id);
                  }}
                  value={theme.id}
                  id={theme.id}
                  key={theme.id}
                >
                  {theme.title}
                </button>
                {theme?.children?.length > 0 &&
                  theme.children.map((child) => {
                    return (
                      <div key={child.id} style={{ marginLeft: "100px" }}>
                        <button
                          onClick={() => {
                            setTheme(child.id);
                            themeHandler(child.id);
                          }}
                          value={child.id}
                          id={child.id}
                          key={child.id}
                        >
                          {theme.title}
                        </button>
                      </div>
                    );
                  })}
              </div>
            );
          })}
          {filters?.categories.map((category) => {
            return (
              <div>
                <label htmlFor={category.id} key={category.id}>
                  <input
                    type="checkbox"
                    onChange={checkboxHandler}
                    value={category.id}
                    id={category.id}
                    key={category.id}
                  />
                  <span>{category.category_name}</span>
                </label>
              </div>
            );
          })}
        </div>
        <div style={{ marginLeft: "50%" }}>
          <Card data={filteredData} />
        </div>
      </div>
    </div>
  );
}

export default App;
