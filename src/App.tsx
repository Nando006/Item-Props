import ItemsJSON from "./components/ItemsJSON";

function App() {
  return (
    <div className="p-10">
      <section>
        <ItemsJSON
          fileSize={50}
          label="Items"
          name="items"
          file={{ visible: true, singleFile: false }}
        />
      </section>
    </div>
  );
}

export default App;
