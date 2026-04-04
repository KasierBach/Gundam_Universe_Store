import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import categoryService from '../../services/categoryService'

const CategoryList = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories()
        setCategories(response)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link 
          key={category._id} 
          to={`/shop?category=${category._id}`}
          className="group relative h-24 flex items-center justify-center glass-card overflow-hidden hover:border-gundam-cyan/50 transition-all"
        >
          <div className="absolute inset-0 bg-gundam-bg-tertiary/50 group-hover:bg-gundam-cyan/10 transition-colors" />
          <span className="relative z-10 font-orbitron font-bold text-xs tracking-widest text-gundam-text-secondary group-hover:text-gundam-cyan uppercase transition-colors text-center px-2">
            {category.name}
          </span>
          <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-gundam-cyan group-hover:w-full transition-all" />
        </Link>
      ))}
    </div>
  )
}

export default CategoryList
