# Contributing to Green Nest 🌱

Thank you for your interest in contributing to Green Nest! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Google AI API key (for AI features)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/green_nest.git
   cd green_nest
   ```

3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/Humayun167/green_nest.git
   ```

## 🛠️ Development Setup

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with required variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   FRONTEND_URL=http://localhost:5173
   PORT=4000
   GOOGLE_API_KEY=your_google_ai_api_key
   ```

4. Start development server:
   ```bash
   npm run server
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   VITE_CURRENCY=$
   VITE_GOOGLE_API_KEY=your_google_ai_api_key
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## 📝 Contribution Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes** - Fix existing issues
- **Feature additions** - Add new functionality
- **Documentation** - Improve or add documentation
- **Performance improvements** - Optimize existing code
- **UI/UX enhancements** - Improve user experience
- **Testing** - Add or improve tests
- **Refactoring** - Improve code quality

### Before You Start

1. Check existing issues and pull requests
2. Create or comment on an issue to discuss your contribution
3. Wait for approval before starting significant work
4. Keep contributions focused and atomic

### Branch Naming Convention

Use descriptive branch names:
- `feature/add-payment-integration`
- `bugfix/fix-cart-update-issue`
- `docs/update-api-documentation`
- `refactor/improve-user-authentication`

## 🎨 Code Style

### JavaScript/React Guidelines

- Use ES6+ features
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Use async/await for promises

### CSS/Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use semantic HTML elements
- Ensure accessibility standards

### Backend Guidelines

- Use RESTful API conventions
- Implement proper error handling
- Use appropriate HTTP status codes
- Add input validation
- Follow MVC pattern
- Use middleware appropriately

### Code Formatting

- Use 2 spaces for indentation
- Use semicolons consistently
- Use single quotes for strings
- Use trailing commas in arrays/objects
- Keep line length under 100 characters

### Example Code Style

```javascript
// Good
const getUserOrders = async (userId) => {
  try {
    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// React Component Example
const ProductCard = ({ product }) => {
  const { addToCart, currency } = useAppContext();
  
  const handleAddToCart = useCallback(() => {
    addToCart(product._id);
  }, [addToCart, product._id]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <img 
        src={product.image[0]} 
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
      <p className="text-primary font-bold">{currency}{product.price}</p>
      <button 
        onClick={handleAddToCart}
        className="w-full mt-3 bg-primary text-white py-2 rounded-md hover:bg-primary-dull transition"
      >
        Add to Cart
      </button>
    </div>
  );
};
```

## 🧪 Testing

### Running Tests

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for React components
- Test error scenarios and edge cases
- Maintain good test coverage

### Test Example

```javascript
// Backend test example
describe('User Authentication', () => {
  test('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/user/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(userData.email);
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

1. Update your fork with the latest changes:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add descriptive commit message"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Guidelines

Write clear, descriptive commit messages:

```
feat: add user product request functionality

- Add product request submission form
- Implement seller approval/rejection workflow
- Add request status tracking
- Update API documentation

Closes #123
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Pull Request Template

When creating a pull request, include:

1. **Description**: What changes were made and why
2. **Type of Change**: Bug fix, feature, documentation, etc.
3. **Testing**: How the changes were tested
4. **Screenshots**: For UI changes
5. **Checklist**: Confirm all requirements are met

### Review Process

1. All PRs require at least one review
2. Address review feedback promptly
3. Keep PRs focused and reasonably sized
4. Ensure CI/CD checks pass
5. Update documentation if needed

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, include:

1. **Environment**: OS, browser, Node.js version
2. **Steps to Reproduce**: Clear, step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Console Errors**: Any error messages

### Bug Report Template

```markdown
**Environment:**
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Node.js Version: [x.x.x]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
A clear description of what you expected to happen.

**Actual Behavior:**
A clear description of what actually happened.

**Screenshots:**
If applicable, add screenshots.

**Console Errors:**
```
Error message here
```

**Additional Context:**
Any other context about the problem.
```

## 💡 Feature Requests

### Proposing Features

1. Check if the feature already exists or was requested
2. Create a detailed issue describing:
   - Problem the feature solves
   - Proposed solution
   - Alternative solutions considered
   - Implementation details (if known)

### Feature Request Template

```markdown
**Problem Description:**
A clear description of the problem this feature would solve.

**Proposed Solution:**
A clear description of what you want to happen.

**Alternative Solutions:**
Alternative solutions you've considered.

**Additional Context:**
Any other context or screenshots about the feature request.

**Implementation Notes:**
Technical details about potential implementation.
```

## 📚 Documentation

### Documentation Standards

- Keep documentation up to date
- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Update API documentation for backend changes

### Areas Needing Documentation

- API endpoints and responses
- Component usage examples
- Setup and configuration guides
- Deployment procedures
- Architecture decisions

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version numbers
2. Update CHANGELOG.md
3. Test all functionality
4. Update documentation
5. Create release notes
6. Tag the release
7. Deploy to production

## 🎯 Development Roadmap

### Current Priorities

1. Complete Stripe payment integration
2. Implement real-time notifications
3. Add comprehensive testing
4. Performance optimizations
5. Mobile application development

### Future Goals

- Multi-language support
- Advanced analytics
- Subscription services
- Third-party integrations
- Machine learning features

## 📞 Getting Help

If you need help or have questions:

1. Check existing documentation
2. Search closed issues
3. Create a new issue with the question label
4. Join our community discussions
5. Contact maintainers directly

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation
- Invited to contributor discussions

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Green Nest! Together, we're building a platform that promotes sustainable living and eco-conscious communities. 🌱✨
