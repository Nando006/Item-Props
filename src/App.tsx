import ItemsJSON from "./components/ItemsJSON";

function App() {
  return (
    <div className="p-10">
      <section>
        <ItemsJSON
          fileSize={50}
          label="Upload"
          name="item-upload"
          singleFile={false}
        />
      </section>
    </div>
  );
}

export default App;
