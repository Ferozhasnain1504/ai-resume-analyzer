interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = '';
  let badgeText = '';

  if (score > 70) {
    badgeColor = 'bg-green-900/30 border border-green-500/30 text-green-400';
    badgeText = 'Strong';
  } else if (score > 49) {
    badgeColor = 'bg-yellow-900/30 border border-yellow-500/30 text-yellow-400';
    badgeText = 'Good Start';
  } else {
    badgeColor = 'bg-red-900/30 border border-red-500/30 text-red-400';
    badgeText = 'Needs Work';
  }

  return (
    <div className={`px-3 py-1 rounded-full ${badgeColor}`}>
      <p className="text-sm font-medium">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;