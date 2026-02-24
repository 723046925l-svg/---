import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'

describe('smoke', () => {
  it('renders app title and navigation', () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByText('Poultry LIMS')).toBeTruthy()
    expect(screen.getByText('Dashboard')).toBeTruthy()
  })
})
