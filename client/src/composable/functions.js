import CharacterService from '../services/CharacterService'

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

export function useGetCharacterIcon(url) {
  return require('@/assets/uploads/characters/' + url.split('.')[0] + '.png')
}

export function useGetSkillIcon(url) {
  return require('@/assets/uploads/skills/' + url.split('.')[0] + '.png')
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