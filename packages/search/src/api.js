const HOST = 'https://calvinhobbes.michelsen.dk'
const API = `${HOST}/search/api`

export async function getTags() {
  const res = await fetch(`${API}/cartoons/tags`)
  return res.json()
}

export async function addTag(tag, dataItem) {
  try {
    const tagLowerCase = tag.toLowerCase()
    await fetch(`${API}/cartoons/${dataItem.id}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag: tagLowerCase }),
    })
    dataItem.tags.push(tagLowerCase);
  } catch { }
}

export async function removeTag(tag, dataItem) {
  try {
    const tagLowerCase = tag.toLowerCase()
    await fetch(`${API}/cartoons/${dataItem.id}/tags/${tag.toLowerCase()}`, {
      method: 'DELETE'
    })
    const index = dataItem.tags.indexOf(tagLowerCase);
    if (index > -1) {
      dataItem.tags.splice(index, 1);
    }
  } catch { }
}
