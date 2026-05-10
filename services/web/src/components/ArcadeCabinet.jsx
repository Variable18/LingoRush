/*
ArcadeCabinet: Minimal black arcade cabinet with a convex CRT screen.
- Wrap children: cabinet-frame > screen-bezel > crt-screen > game-content
- Props: children, className?, style?, title?
*/
import { Link } from 'react-router-dom';
import './ArcadeCabinet.css';
import InnerArcadePanel from './InnerArcadePanel';

export default function ArcadeCabinet({ children, className = '', style, title }) {
	return (
		<div className={`arcade-cabinet ${className}`} style={style}>
			{title ? <div className="cabinet-title" aria-hidden>{title}</div> : null}
			<div className="cabinet-frame">
				<div className="screen-bezel">
					<div className="crt-screen">
						<div className="crt-topbar">
							<div className="topbar-row">
								<Link to="/learn/german" className="overlay-back">← Back to Levels</Link>
								<InnerArcadePanel />
							</div>
						</div>
						<div className="game-content" role="region" aria-label="Arcade Screen">
							{children}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

