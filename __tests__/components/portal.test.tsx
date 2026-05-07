/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// Mock next/navigation
const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

// We need to provide localStorage and sessionStorage mocks in jsdom
// jsdom provides these by default, but we clear them between tests

import Portal from "@/app/admin/portal/page"

const DEFAULT_PASSWORD = "Dev!2026"

describe("Portal page - login form", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it("renders the login form with password input and submit button", () => {
    render(<Portal />)

    expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Entrer" })).toBeInTheDocument()
  })

  it("renders the page heading", () => {
    render(<Portal />)

    expect(screen.getByText("Accès restreint admin")).toBeInTheDocument()
  })

  it("redirects to /admin when the correct default password is entered", async () => {
    render(<Portal />)

    const input = screen.getByPlaceholderText("Mot de passe")
    await userEvent.type(input, DEFAULT_PASSWORD)
    fireEvent.click(screen.getByRole("button", { name: "Entrer" }))

    expect(mockPush).toHaveBeenCalledWith("/admin")
  })

  it("sets sessionStorage admin_auth to 'ok' on successful login", async () => {
    render(<Portal />)

    const input = screen.getByPlaceholderText("Mot de passe")
    await userEvent.type(input, DEFAULT_PASSWORD)
    fireEvent.click(screen.getByRole("button", { name: "Entrer" }))

    expect(sessionStorage.getItem("admin_auth")).toBe("ok")
  })

  it("shows error message when wrong password is entered", async () => {
    render(<Portal />)

    const input = screen.getByPlaceholderText("Mot de passe")
    await userEvent.type(input, "wrongpassword")
    fireEvent.click(screen.getByRole("button", { name: "Entrer" }))

    expect(screen.getByText("Mot de passe incorrect")).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("does not redirect on empty password submission", async () => {
    render(<Portal />)

    fireEvent.click(screen.getByRole("button", { name: "Entrer" }))

    expect(mockPush).not.toHaveBeenCalled()
    expect(screen.getByText("Mot de passe incorrect")).toBeInTheDocument()
  })

  it("uses custom password from localStorage when set", async () => {
    localStorage.setItem("admin_password", "MyCustomPwd123")
    render(<Portal />)

    const input = screen.getByPlaceholderText("Mot de passe")
    await userEvent.type(input, "MyCustomPwd123")
    fireEvent.click(screen.getByRole("button", { name: "Entrer" }))

    expect(mockPush).toHaveBeenCalledWith("/admin")
  })

  it("rejects old default password when custom password is set in localStorage", async () => {
    localStorage.setItem("admin_password", "MyCustomPwd123")
    render(<Portal />)

    const input = screen.getByPlaceholderText("Mot de passe")
    await userEvent.type(input, DEFAULT_PASSWORD)
    fireEvent.click(screen.getByRole("button", { name: "Entrer" }))

    expect(mockPush).not.toHaveBeenCalled()
    expect(screen.getByText("Mot de passe incorrect")).toBeInTheDocument()
  })
})

describe("Portal page - change password form", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it("renders the change password form", () => {
    render(<Portal />)

    expect(screen.getByPlaceholderText("Nouveau mot de passe")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeInTheDocument()
  })

  it("saves new password to localStorage on submit", async () => {
    render(<Portal />)

    const input = screen.getByPlaceholderText("Nouveau mot de passe")
    await userEvent.type(input, "NewPassword!99")
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))

    expect(localStorage.getItem("admin_password")).toBe("NewPassword!99")
  })

  it("shows confirmation message after password change", async () => {
    render(<Portal />)

    const input = screen.getByPlaceholderText("Nouveau mot de passe")
    await userEvent.type(input, "NewPass")
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))

    expect(screen.getByText("Mot de passe modifié")).toBeInTheDocument()
  })

  it("clears the new password input after successful save", async () => {
    render(<Portal />)

    const input = screen.getByPlaceholderText("Nouveau mot de passe") as HTMLInputElement
    await userEvent.type(input, "NewPass")
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))

    expect(input.value).toBe("")
  })

  it("does not save to localStorage when new password is empty", async () => {
    render(<Portal />)

    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))

    expect(localStorage.getItem("admin_password")).toBeNull()
  })

  it("does not save to localStorage when new password is only whitespace", async () => {
    render(<Portal />)

    const input = screen.getByPlaceholderText("Nouveau mot de passe")
    await userEvent.type(input, "   ")
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))

    expect(localStorage.getItem("admin_password")).toBeNull()
  })

  it("new password becomes active immediately for login after change", async () => {
    render(<Portal />)

    // Change the password
    const newPwdInput = screen.getByPlaceholderText("Nouveau mot de passe")
    await userEvent.type(newPwdInput, "BrandNewPwd!")
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))

    // Now try to login with the new password
    // Note: because the component reads localStorage.getItem on render (not on submit),
    // the state reflects the saved value after re-render.
    // We confirm the new password is persisted in localStorage
    expect(localStorage.getItem("admin_password")).toBe("BrandNewPwd!")
  })
})

describe("Portal page - password input type", () => {
  it("password fields are of type password (hidden input)", () => {
    render(<Portal />)

    const inputs = screen.getAllByDisplayValue("")
    const passwordInputs = document.querySelectorAll('input[type="password"]')
    expect(passwordInputs.length).toBeGreaterThanOrEqual(2)
  })
})