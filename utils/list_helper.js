const { error } = require('./logger')

const dummy = (blogs) => {
  return Array.isArray(blogs) ? 1 : error('the parameter needs to be an array')
}

//Lasketaan yhteen kaikki tykkäykset koko listasta
const totalLikes = (blogs) => {
  return Array.isArray(blogs)
    ? blogs.reduce((sum, item) => {
        return sum + item.likes
      }, 0)
    : error('the parameter needs to be an array')
}

/*Etsitään eniten tykkäuksiä saanut blogi listasta. Blogit sortataan kasvavassa järjestyksessä ja
  viimeinen, eli suurin, palautetaan siistityssä formaatissa.*/
const favoriteBlog = (blogs) => {
  if (Array.isArray(blogs)) {
    const blogsToSort = [...blogs]
    const sortedBlogs = blogsToSort.sort((a, b) => a.likes - b.likes)
    const favorite = sortedBlogs.pop()
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes,
    }
  } else {
    error('the parameter needs to be an array')
  }
}

/*Blogeista etsitään eniten esiintyvä kirjoittaja ja palautetaan se siistityssä formaatissa*/
const mostBlogs = (blogs) => {
  if (Array.isArray(blogs) && blogs.length > 1) {
    //pelkistetään blogilista pelkiksi kirjoittajiksi
    const authors = blogs.map((blog) => blog.author)
    //kootaan uniikit kirjoittajat yhteen
    const uniqueAuthors = [...new Set(authors)]
    let counted = []

    /*Lasketaan halutun kirjailijan esiintyminen annetussa taulukossa.
    Jos ja kun listassa kohdataan haluttu nimi, lisätään esiintymisien määrää
    yhdellä, muuten määrä pysyy samana.*/
    const countAuthors = (allAuthors, searchedAuthor) =>
      allAuthors.reduce((amount, author) => {
        return author === searchedAuthor ? amount + 1 : amount
      }, 0)

    /*Käydään läpi lista blogien kirjoittajista kerran kutakin uniikkia kirjoittajaa kohden
    ja lisätään tulokset yhteen counted-taulukkoon.*/
    for (const author of uniqueAuthors) {
      const amount = countAuthors(authors, author)
      counted.push({
        author: author,
        blogs: amount,
      })
    }

    //järjestetään lasketut tulokset kasvavaan järjestykseen ja palautetaan viimeinen (suurin)
    const sorted = counted.sort((a, b) => a.blogs - b.blogs)
    return sorted.pop()

    //jos parametriksi annetaan taulukko, jossa on vain yksi blogi, palautetaan se oikeassa formaatissa
  } else if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      blogs: 1,
    }
  } else {
    error('the parameter needs to be an array with one or more blogs')
  }
}

/*Blogeista etsitään eniten tykkäyksiä saanut kirjoittaja ja palautetaan se siistityssä formaatissa*/
const mostLikes = (blogs) => {
  if (Array.isArray(blogs) && blogs.length > 1) {
    //pelkistetään blogilista pelkiksi kirjoittajiksi
    const authors = blogs.map((blog) => blog.author)
    //kootaan uniikit kirjoittajat yhteen
    const uniqueAuthors = [...new Set(authors)]
    let counted = []

    /*Lasketaan yhteen annetun kirjoittajan tykkäykset annetussa listassa.
    Aina kun haluttu kirjoittaja tulee listassa vastaan, lisätään tykkäyksiä ko. blogin tykkäyksien verran*/
    const countLikes = (allBlogs, searchedAuthor) =>
      allBlogs.reduce((likes, blog) => {
        return blog.author === searchedAuthor ? likes + blog.likes : likes
      }, 0)

    /*Käydään läpi lista blogien kirjoittajista kerran kutakin uniikkia kirjoittajaa kohden
    ja lisätään tulokset yhteen counted-taulukkoon.*/
    for (const author of uniqueAuthors) {
      const likes = countLikes(blogs, author)
      counted.push({
        author: author,
        likes: likes,
      })
    }

    //järjestetään lasketut tulokset kasvavaan järjestykseen ja palautetaan viimeinen (suurin)
    const sorted = counted.sort((a, b) => a.likes - b.likes)
    return sorted.pop()

    //jos parametriksi annetaan taulukko, jossa on vain yksi blogi, palautetaan se oikeassa formaatissa
  } else if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      likes: blogs[0].likes,
    }
  } else {
    error('the parameter needs to be an array with one or more blogs')
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
