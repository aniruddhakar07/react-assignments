/**
 * Password Strength Evaluator
 * Evaluates password criteria and computes strength metrics
 */

export const evaluatePasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: 'Empty',
      color: '#64748b',
      percentage: 0,
      criteria: [
        { label: 'At least 8 characters', met: false },
        { label: 'Contains uppercase letter (A-Z)', met: false },
        { label: 'Contains lowercase letter (a-z)', met: false },
        { label: 'Contains number (0-9)', met: false },
        { label: 'Contains special symbol (@$!%*?&)', met: false }
      ]
    };
  }

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteria = [
    { label: 'At least 8 characters', met: hasMinLength },
    { label: 'Contains uppercase letter (A-Z)', met: hasUpper },
    { label: 'Contains lowercase letter (a-z)', met: hasLower },
    { label: 'Contains number (0-9)', met: hasNumber },
    { label: 'Contains special symbol (@$!%*?&)', met: hasSpecial }
  ];

  const metCount = criteria.filter(c => c.met).length;

  let score = 1;
  let label = 'Weak';
  let color = '#fb7185'; // Rose / Red

  if (metCount >= 5 && password.length >= 10) {
    score = 4;
    label = 'Strong';
    color = '#34d399'; // Emerald
  } else if (metCount >= 4) {
    score = 3;
    label = 'Good';
    color = '#60a5fa'; // Blue
  } else if (metCount >= 2) {
    score = 2;
    label = 'Fair';
    color = '#fbbf24'; // Amber
  } else {
    score = 1;
    label = 'Weak';
    color = '#fb7185';
  }

  return {
    score,
    label,
    color,
    percentage: (score / 4) * 100,
    criteria
  };
};
