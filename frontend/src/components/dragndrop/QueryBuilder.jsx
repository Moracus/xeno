import Toolbar from "./Toolbar";
import QueryBuilderCanvas from "./QueryBuilderCanvas";

const QueryBuilder = ({ setQuery }) => {
  return (
    <div className="flex w-full h-full">
      <Toolbar />
      <QueryBuilderCanvas setQuery={setQuery} />
    </div>
  );
};

export default QueryBuilder;
