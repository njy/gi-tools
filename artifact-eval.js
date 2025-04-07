import { For } from "https://esm.sh/solid-js@1.9.5";
import { createStore } from "https://esm.sh/solid-js@1.9.5/store";
import { render } from "https://esm.sh/solid-js@1.9.5/web";
import html from "https://esm.sh/solid-js@1.9.5/html";
import { stats, breakdownRolls, rollValue } from "./roll-generator.js";

const initialState = stats.map((title) => ({
  title,
  enabled: false,
  value: "",
}));

const App = () => {
  const [store, setStore] = createStore({
    stats: initialState,
  });

  const updateStat = (title, partial) => {
    setStore(
      "stats",
      (oldStat) => oldStat.title === title,
      (oldStat) => ({ ...oldStat, ...partial })
    );
  };

  return html`
    <table>
      <thead>
        <tr class="border-b border-gray-300">
          <th></th>
          <th class="py-1 px-2">Stat</th>
          <th class="py-1 px-2">Value</th>
          <th class="py-1 px-2">Breakdown</th>
          <th class="py-1 px-2">Roll value</th>
          <th class="py-1 px-2 text-right">
            <button
              class="bg-white hover:bg-gray-200 px-2 py-1 rounded"
              onClick=${(event) =>
                setStats(
                  () => true,
                  (oldVal) => ({ title: oldVal.title, enabled: false, value: "" })
                )}
            >
              Clear all
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <${For} each=${() => store.stats}
          >${(stat) => html`<tr class="border-b border-gray-150">
            <td class="py-2 px-2">
              <input
                type="checkbox"
                checked=${() => stat.enabled}
                onChange=${(event) => updateStat(stat.title, { enabled: event.target.checked })}
              />
            </td>
            <td class="py-2 px-2">${stat.title}</td>
            <td class="py-2 px-2">
              <input
                type="text"
                class="bg-white px-2 py-1 border border-grey-300 shadow-sm focus:ring-sky-500 focus:ring-1 w-20 rounded"
                value=${() => stat.value}
                onInput=${(event) => updateStat(stat.title, { value: event.target.value })}
              />
            </td>
            <td class="py-2 px-2">${() => breakdownRolls(stat.title, stat.value)}</td>
            <td class="py-2 px-2">${() => rollValue(stat.title, stat.value)}</td>
            <td class="py-2 px-2 text-right">
              <button
                class="bg-white hover:bg-gray-200 p-1 rounded"
                onClick=${(event) => updateStat(stat.title, { value: "", enabled: false })}
              >
                Clear
              </button>
            </td>
          </tr>`}
        <//>
      </tbody>
    </table>
  `;
};
render(App, document.getElementById("solid-app"));
