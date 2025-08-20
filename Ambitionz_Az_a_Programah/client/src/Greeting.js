
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
const root = ReactDOM.createRoot(document.getElementById('root'));
const element = <Welcome name="Dr woelfl Andreas" />;
root.render(element);