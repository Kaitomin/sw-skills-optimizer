import CharacterService from '../services/CharacterService'
import LoggerService from '../services/LoggerService'

/**
 * Character/skill icons
 */
export async function useGetCharactersIcons() {
  try {
    const res = await CharacterService.getAllCharacters()
    return res.data.charList;
  } catch (error) {
    console.log('Error :', error);
  }
}

/*
** Skill Table
*/
export function useDisplayTooltip(e) {
  if (e.target.classList.contains("tooltip-container")) {
    e.target.children[0].style.display = "block"
  }
}

export function useHideTooltip(e) {
  if (e.target.classList.contains("tooltip-container")) {
    e.target.children[0].style.display = "none"
  }
}

export function useSortTable() {
  let tbody = document.querySelector('tbody');
  let tr = Array.from(document.querySelectorAll('tbody tr'));

  tr.forEach(tr => tr.remove())
  tr.sort((a, b) => {
    return a.querySelector('td.dps').textContent - b.querySelector('td.dps').textContent
  })
  tr.forEach(tr => tbody.append(tr))
}

/**
 * Logger
 */
export async function useSetLogger(skill) {
  const date = new Date();

  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let month =
    date.getMonth() + 1 < 10
      ? "0" + date.getMonth() + 1
      : date.getMonth() + 1;
  let year = date.getFullYear();
  let hours =
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes =
    date.getMinutes() < 10
      ? "0" + date.getMinutes()
      : date.getMinutes();
  let seconds =
    date.getSeconds() < 10
      ? "0" + date.getSeconds()
      : date.getSeconds();

  const currentDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  await LoggerService.setLogger({ currentDate, skill });
}

/**
 * Hash version for production
 */
export const hash = Math.floor(Math.random() * 90000) + 10000;