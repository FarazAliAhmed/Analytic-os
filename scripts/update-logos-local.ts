import { prisma } from '../src/lib/prisma'
import * as fs from 'fs'
import * as path from 'path'

async function updateLogosToLocal() {
  try {
    console.log('Scanning public/logos/ folder...\n')

    const logosDir = path.join(process.cwd(), 'public', 'logos')
    const files = fs.readdirSync(logosDir)
    
    // Filter out README and get actual logo files
    const logoFiles = files.filter(file => 
      !file.startsWith('.') && 
      !file.includes('README') &&
      (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || 
       file.endsWith('.webp') || file.endsWith('.svg') || 
       file.endsWith('.PNG') || file.endsWith('.JPG') || file.endsWith('.JPEG') || 
       file.endsWith('.WEBP') || file.endsWith('.SVG'))
    )

    console.log(`Found ${logoFiles.length} logo files:`)
    logoFiles.forEach(file => console.log(`  - ${file}`))
    console.log('')

    const tokenSymbols = ['FMY', 'ABMFB', 'FCMB', 'NOMBA', 'OPAY']
    const logoUpdates: { symbol: string; logoUrl: string }[] = []

    for (const symbol of tokenSymbols) {
      // Find matching file (case-insensitive)
      const matchingFile = logoFiles.find(file => {
        const fileNameWithoutExt = file.split('.')[0].toUpperCase()
        return fileNameWithoutExt === symbol.toUpperCase()
      })

      if (matchingFile) {
        logoUpdates.push({
          symbol,
          logoUrl: `/logos/${matchingFile}`
        })
      } else {
        console.log(`⚠️  Warning: No logo file found for ${symbol}`)
      }
    }

    console.log('\nUpdating database...\n')

    for (const update of logoUpdates) {
      const token = await prisma.token.update({
        where: { symbol: update.symbol },
        data: { logoUrl: update.logoUrl }
      })
      
      console.log(`✅ Updated ${token.symbol} → ${update.logoUrl}`)
    }

    console.log('\n✅ All logos updated successfully!')
  } catch (error) {
    console.error('❌ Error updating logos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateLogosToLocal()
